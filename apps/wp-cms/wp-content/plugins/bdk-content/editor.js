/* global jQuery, wp */
function bdkMediaDescription(attachment) {
  if (!attachment || typeof attachment !== 'object') return '';
  const parts = [];
  if (attachment.filename) parts.push(String(attachment.filename));
  if (attachment.id) parts.push('ID ' + attachment.id);
  if (attachment.width && attachment.height) parts.push(attachment.width + ' \u00d7 ' + attachment.height);
  if (!parts.length) return '';
  return 'Selected: ' + parts.join(', ');
}
jQuery(document).on('click', '.bdk-media', function () {
  const button = this;
  const target = document.getElementById(button.dataset.target);
  if (!target) return;
  const frame = wp.media({
    title: 'Choose website image',
    multiple: false,
    library: { type: 'image' },
  });
  frame.on('select', () => {
    const attachment = frame.state().get('selection').first().toJSON();
    target.value = attachment.url;
    target.dispatchEvent(new Event('change', { bubbles: true }));
    const altTarget = document.getElementById(button.dataset.altTarget || '');
    if (altTarget && altTarget.value.trim() === '' && attachment.alt) {
      altTarget.value = attachment.alt;
      altTarget.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const descTarget = document.getElementById(button.dataset.descTarget || '');
    if (descTarget) descTarget.textContent = bdkMediaDescription(attachment);
  });
  frame.open();
});
jQuery(document).on('input change', 'input', function () {
  for (const button of document.querySelectorAll('.bdk-media')) {
    if (button.dataset.target !== this.id) continue;
    const description = document.getElementById(button.dataset.descTarget || '');
    if (description) description.textContent = '';
  }
});

/* global bdkEditorial, bdkPreview */
// Durable draft workflow for already-published fixed records only. Uses the
// working-copy REST contract; never submits the native post form, so the page
// status stays published and the page can never be taken offline from here.
(function () {
  if (!window.bdkEditorial || !window.bdkEditorial.isFixedPublished) return;
  const box = document.getElementById('bdk-publication');
  if (!box) return;
  const cfg = window.bdkEditorial;
  const statusEl = document.getElementById('bdk-working-status');
  const metaEl = document.getElementById('bdk-draft-meta');
  const schedEl = document.getElementById('bdk-scheduled-meta');
  const deployEl = document.getElementById('bdk-deploy-status');
  const retryBtn = document.getElementById('bdk-deploy-retry');
  const actionBtns = Array.from(box.querySelectorAll('button:not(#bdk-deploy-retry)'));

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.classList.toggle('bdk-error', kind === 'error');
    statusEl.classList.toggle('bdk-ok', kind === 'ok');
  }

  function namePath(name) {
    const path = [];
    const re = /\[([^\]]*)\]/g;
    let m;
    while ((m = re.exec(name.slice('bdk_copy'.length)))) { if (m[1] !== '') path.push(m[1]); }
    return path;
  }

  // Raw strings from the visible fields, nesting preserved. Unchecked boxes
  // contribute nothing; each boolean ships a hidden 0 fallback input.
  // On any recoverable error the fields are left untouched so edits are kept.
  function collectRaw() {
    const data = {};
    document.querySelectorAll('[name^="bdk_copy["]').forEach((el) => {
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      const path = namePath(el.name);
      if (!path.length) return;
      let node = data;
      path.forEach((key, i) => {
        if (i === path.length - 1) node[key] = el.value;
        else node = node[key] = node[key] && typeof node[key] === 'object' ? node[key] : {};
      });
    });
    return data;
  }

  // Convert leaves using the definition descriptor map (PHP mirrors the same
  // rules in bdk_form_values, and the ERP load expects real numbers).
  // Unknown keys stay strings for backend validation to judge.
  function typeLeaf(value, type) {
    if (type === 'number') {
      if (value === '' || value === null || value === undefined) return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    if (type === 'boolean') return value === true || value === '1';
    if (type === 'strings') return String(value === null || value === undefined ? '' : value).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    return value;
  }
  function typeData(node, path) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
    const out = {};
    for (const key of Object.keys(node)) {
      const p = path ? path + '.' + key : key;
      const t = (cfg.fieldTypes || {})[p];
      const v = node[key];
      out[key] = (t === 'group' || (v && typeof v === 'object' && !Array.isArray(v))) ? typeData(v, p) : typeLeaf(v, t);
    }
    return out;
  }
  function collectData() { return typeData(collectRaw(), ''); }

  function valueAt(data, path) {
    let node = data;
    for (const key of path) {
      if (!node || typeof node !== 'object' || !(key in node)) return undefined;
      node = node[key];
    }
    return node;
  }

  // Rewrite visible fields from server data (after discard). Unknown paths untouched.
  function applyDataToForm(data) {
    document.querySelectorAll('[name^="bdk_copy["]').forEach((el) => {
      const path = namePath(el.name);
      if (!path.length) return;
      const value = valueAt(data, path);
      if (value === undefined) return;
      if (el.type === 'checkbox') { el.checked = value === true || value === '1'; return; }
      if (el.type === 'radio' || el.type === 'hidden') return;
      el.value = Array.isArray(value) ? value.join('\n') : (value === null ? '' : String(value));
      if (typeof Event !== 'undefined' && el.dispatchEvent) el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async function api(url, method, body) {
    let response;
    try {
      response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) {
      throw new Error('Could not reach WordPress. Your edits are still in the form — try again.');
    }
    let result = {};
    try { result = await response.json(); } catch (e) { /* non-JSON: fall through to status handling */ }
    if (!response.ok) throw new Error(result.message || 'Request failed. Your edits are still in the form.');
    return result;
  }

  function browserTz() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; }
  }
  // Unix seconds (or numeric strings) render as readable dates with an
  // explicit zone; anything else passes through untouched.
  function fmtTs(ts) {
    const n = typeof ts === 'number' ? ts : (typeof ts === 'string' && /^\d+$/.test(ts.trim()) ? parseInt(ts.trim(), 10) : NaN);
    if (!Number.isFinite(n) || n <= 0) return typeof ts === 'string' ? ts : '';
    const tz = browserTz();
    try {
      return new Date(n * 1000).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) + (tz ? ' (' + tz + ')' : '');
    } catch (e) { return new Date(n * 1000).toUTCString(); }
  }

  function describeWorking(result) {
    const working = result.working || {};
    if (working.savedAt) metaEl.textContent = 'Draft saved ' + fmtTs(working.savedAt) + (working.savedBy ? ' by ' + working.savedBy : '') + '. Live copy unchanged.';
    else metaEl.textContent = 'No draft saved yet — fields show the live copy.';
    const s = result.scheduled;
    schedEl.textContent = s && s.publishAt ? 'Scheduled to publish ' + fmtTs(s.publishAt) + (s.scheduledBy ? ' by ' + s.scheduledBy : '') + '.' : '';
  }

  function setBusy(busy) { actionBtns.forEach((b) => { b.disabled = busy; }); }

  async function refresh() {
    try {
      const result = await api(cfg.workingCopy, 'GET');
      describeWorking(result);
      setStatus('Draft workflow ready. Save a draft, preview it, then publish.', 'ok');
    } catch (error) {
      setStatus(error.message + ' (Draft actions unavailable; fields remain editable.)', 'error');
      setBusy(true);
    }
  }

  // Publish/schedule send no data themselves: the backend ignores it. Always
  // persist the form with save first and abort the action when saving fails,
  // so entered values are never silently dropped.
  async function saveFirst() {
    const result = await api(cfg.workingCopy, 'POST', { action: 'save', data: collectData() });
    describeWorking(result);
    return result;
  }

  async function run(label, body, done) {
    setBusy(true);
    setStatus(label + '…');
    try {
      const result = await api(cfg.workingCopy, 'POST', body);
      describeWorking(result);
      setStatus(done, 'ok');
      refreshDeploy();
    } catch (error) {
      setStatus(error.message, 'error'); // attempted values preserved: fields untouched
    } finally {
      setBusy(false);
    }
  }

  function scheduleTime() {
    const input = document.getElementById('bdk-schedule-at');
    const ms = Date.parse(input.value);
    if (!input.value || Number.isNaN(ms)) { setStatus('Choose a schedule date and time first. Nothing was saved.', 'error'); input.focus(); return null; }
    const at = Math.floor(ms / 1000);
    if (at <= Math.floor(Date.now() / 1000)) { setStatus('Schedule time must be in the future. Nothing was saved.', 'error'); input.focus(); return null; }
    return at;
  }

  async function publishFlow() {
    setBusy(true);
    try {
      setStatus('Saving draft…');
      await saveFirst();
      setStatus('Publishing…');
      const result = await api(cfg.workingCopy, 'POST', { action: 'publish' });
      describeWorking(result);
      setStatus('Published. The live copy updates on the next site rebuild — see Site publication below.', 'ok');
      refreshDeploy();
    } catch (error) {
      setStatus(error.message, 'error'); // entered values preserved: fields untouched
    } finally {
      setBusy(false);
    }
  }

  async function scheduleFlow() {
    const publishAt = scheduleTime();
    if (publishAt === null) return;
    setBusy(true);
    try {
      setStatus('Saving draft…');
      await saveFirst();
      setStatus('Scheduling…');
      const result = await api(cfg.workingCopy, 'POST', { action: 'schedule', publishAt });
      describeWorking(result);
      setStatus('Scheduled. The draft publishes automatically at the scheduled time.', 'ok');
      refreshDeploy();
    } catch (error) {
      setStatus(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function discardFlow() {
    setBusy(true);
    setStatus('Discarding draft…');
    try {
      const result = await api(cfg.workingCopy, 'POST', { action: 'discard' });
      describeWorking(result);
      if (result.working && result.working.data && typeof result.working.data === 'object') applyDataToForm(result.working.data);
      setStatus('Draft discarded. Fields now show the live copy. A scheduled publish, if any, is kept — cancel it separately.', 'ok');
    } catch (error) {
      setStatus(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  document.getElementById('bdk-save-draft').addEventListener('click', () =>
    run('Saving draft', { action: 'save', data: collectData() }, 'Draft saved. Live copy unchanged — preview it from the “Astro website preview” box.'));
  const publishBtn = document.getElementById('bdk-publish-now');
  if (publishBtn) publishBtn.addEventListener('click', publishFlow);
  const schedBtn = document.getElementById('bdk-schedule');
  if (schedBtn) schedBtn.addEventListener('click', scheduleFlow);
  document.getElementById('bdk-cancel-schedule').addEventListener('click', () => {
    if (!window.confirm('Cancel the scheduled publish? The saved draft is kept.')) return;
    run('Cancelling schedule', { action: 'cancel' }, 'Schedule cancelled. The saved draft is kept; nothing went live.');
  });
  document.getElementById('bdk-discard-draft').addEventListener('click', () => {
    if (!window.confirm('Discard the saved draft? Fields will be reset to the live copy. A scheduled publish is kept — cancel it separately if needed.')) return;
    discardFlow();
  });

  // Honest site publication state. "dispatched" is never labelled live; a
  // missing completion configuration stays pending, never fake-live.
  async function refreshDeploy() {
    deployEl.textContent = 'Checking publication status…';
    retryBtn.hidden = true;
    try {
      const s = await api(cfg.deployStatus, 'GET');
      const state = String(s.state || '').toLowerCase();
      const detail = ' (attempt ' + (s.attempt || 1) + (s.at ? ', ' + fmtTs(s.at) : '') + (s.deploymentId ? ', build ' + s.deploymentId : '') + ')';
      if (state === 'live') deployEl.textContent = 'Live: the published copy is on the site.' + detail;
      else if (state === 'building') deployEl.textContent = 'Rebuilding the site now — your publish is not live yet.' + detail;
      else if (state === 'dispatched' || state === 'dispatch accepted (deployment pending)') deployEl.textContent = 'Sent to the site builder and waiting — not live yet.' + detail;
      else if (state === 'queued') deployEl.textContent = 'A site rebuild is queued — not live yet.' + detail;
      else if (state === 'failed') {
        deployEl.textContent = 'The last site rebuild failed' + (s.message ? ': ' + s.message : '') + (s.httpStatus ? ' (HTTP ' + s.httpStatus + ')' : '') + '.' + detail + ' Your published copy is saved; retry below.';
        retryBtn.hidden = false;
      } else deployEl.textContent = 'Publication status pending — completion is not configured. Your publish is saved; the site updates once configured.';
    } catch (error) {
      deployEl.textContent = 'Could not check publication status. ' + error.message;
    }
  }
  retryBtn.addEventListener('click', async () => {
    retryBtn.disabled = true;
    try {
      await api(cfg.deployRetry, 'POST', {});
      await refreshDeploy();
    } catch (error) {
      deployEl.textContent = error.message;
    } finally {
      retryBtn.disabled = false;
    }
  });

  // The datetime-local value has no zone; it is read as browser-local time and
  // labelled that way — never presented as site time.
  const tzEl = document.getElementById('bdk-schedule-tz');
  if (tzEl) {
    const tz = browserTz();
    if (tz) tzEl.textContent = 'Browser time: ' + tz + ' (detected automatically). The picked time is saved as a Unix timestamp.';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { refresh(); refreshDeploy(); });
  else { refresh(); refreshDeploy(); }
})();
// Snapshot of the current (possibly unsaved) form; never updates published content.
async function bdkRequestPreview() {
  const fields = jQuery('[name^="bdk_copy["]').serialize();
  const payload = { postId: bdkPreview.postId, form: fields, target: document.getElementById('bdk-preview-target').value };
  const editor = window.wp?.data?.select('core/editor');
  if (editor?.getCurrentPostType() === 'post') {
    payload.title = editor.getEditedPostAttribute('title');
    payload.content = editor.getEditedPostContent();
  } else if (document.getElementById('content')) {
    payload.title = document.getElementById('title').value;
    payload.content =
      window.tinymce?.get('content')?.getContent() ??
      document.getElementById('content').value;
  }
  const response = await fetch(bdkPreview.endpoint, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': bdkPreview.nonce,
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Preview failed.');
  return result.url;
}

jQuery(document).on('click', '#bdk-preview-button', async function () {
  const status = document.getElementById('bdk-preview-status');
  const tab = window.open('about:blank', '_blank');
  if (tab) tab.opener = null;
  this.disabled = true;
  status.textContent = 'Preparing a private snapshot…';
  try {
    const url = await bdkRequestPreview();
    if (tab) tab.location = url;
    else window.location.assign(url);
    status.textContent = 'Preview opened. Published copy has not been changed.';
  } catch (error) {
    if (tab) tab.close();
    status.textContent = error.message;
  } finally {
    this.disabled = false;
  }
});

// Docked live preview: refreshes after edits, keeps scroll position and links sections both ways.
const bdkLive = { panel: null, frame: null, pending: null, observer: null, request: 0, timer: 0, scrollY: 0, section: null, device: 'desktop' };
const BDK_DESKTOP_WIDTH = 1280;

function bdkLiveOrigin() {
  return bdkPreview.targets[document.getElementById('bdk-preview-target').value]?.origin;
}

function bdkLiveStatus(text) {
  if (bdkLive.panel) bdkLive.panel.querySelector('.bdk-live-status').textContent = text;
}

// Desktop renders the real desktop layout scaled into the panel; mobile renders at phone width.
function bdkLiveFit() {
  if (!bdkLive.panel) return;
  const stage = bdkLive.panel.querySelector('.bdk-live-stage');
  const scale = bdkLive.device === 'desktop' ? Math.min(1, stage.clientWidth / BDK_DESKTOP_WIDTH) : 1;
  const width = bdkLive.device === 'desktop' ? BDK_DESKTOP_WIDTH : 390;
  for (const frame of stage.querySelectorAll('iframe')) {
    Object.assign(frame.style, {
      width: `${width}px`,
      height: `${stage.clientHeight / scale}px`,
      transform: `scale(${scale})`,
      left: bdkLive.device === 'desktop' ? '0' : `calc(50% - ${width / 2}px)`,
    });
  }
}

function bdkShowFrame(frame, ready) {
  if (bdkLive.pending !== frame) return;
  bdkLive.frame?.remove();
  bdkLive.frame = frame;
  bdkLive.pending = null;
  frame.classList.remove('bdk-live-next');
  bdkLiveStatus(ready ? 'Showing your current edits. Click a section to jump to its fields.' : 'Preview loaded.');
}

async function bdkRefreshLive() {
  const request = ++bdkLive.request;
  // An older snapshot still loading must never replace this request's result or error.
  bdkLive.pending?.remove();
  bdkLive.pending = null;
  bdkLiveStatus('Updating…');
  try {
    const url = await bdkRequestPreview();
    if (request !== bdkLive.request || !bdkLive.panel) return;
    const frame = document.createElement('iframe');
    frame.title = 'Website preview';
    frame.className = 'bdk-live-next';
    frame.src = url;
    bdkLive.pending = frame;
    bdkLive.panel.querySelector('.bdk-live-stage').append(frame);
    bdkLiveFit();
    // Error pages and other preview targets have no section script; show them once loaded.
    frame.addEventListener('load', () => setTimeout(() => bdkShowFrame(frame, false), 2000));
  } catch (error) {
    if (request === bdkLive.request) bdkLiveStatus(error.message);
  }
}

function bdkOpenLive() {
  const panel = document.createElement('aside');
  panel.id = 'bdk-live';
  panel.setAttribute('aria-label', 'Live website preview');
  panel.innerHTML = `
    <div class="bdk-live-bar">
      <strong>Live preview</strong>
      <select class="bdk-live-device" aria-label="Preview width">
        <option value="desktop">Desktop</option>
        <option value="mobile">Mobile</option>
      </select>
      <span class="bdk-live-status" role="status"></span>
      <button type="button" class="button-link bdk-live-close">Close</button>
    </div>
    <div class="bdk-live-stage"></div>`;
  document.body.append(panel);
  document.body.classList.add('bdk-live-open');
  bdkLive.panel = panel;
  bdkLive.device = 'desktop';
  bdkLive.observer = new ResizeObserver(bdkLiveFit);
  bdkLive.observer.observe(panel.querySelector('.bdk-live-stage'));
  const button = document.getElementById('bdk-live-button');
  button.setAttribute('aria-expanded', 'true');
  button.textContent = 'Hide live preview';
  bdkRefreshLive();
}

function bdkCloseLive() {
  bdkLive.request++;
  clearTimeout(bdkLive.timer);
  bdkLive.observer?.disconnect();
  bdkLive.panel?.remove();
  Object.assign(bdkLive, { panel: null, frame: null, pending: null, observer: null, section: null });
  document.body.classList.remove('bdk-live-open');
  const button = document.getElementById('bdk-live-button');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Show live preview beside the form';
  button.focus();
}

function bdkGoToSection(record, section) {
  if (record !== bdkPreview.record) {
    const url = new URL(bdkPreview.editSection);
    url.searchParams.set('record', record);
    url.searchParams.set('section', section);
    // The click happened inside the preview frame, so popup blockers may refuse this; offer a link instead.
    const tab = window.open(url, '_blank');
    if (tab) {
      tab.opener = null;
      bdkLiveStatus('That section is shared copy; it opened in a new tab.');
      return;
    }
    bdkLiveStatus('That section is shared copy. ');
    const link = Object.assign(document.createElement('a'), { href: url, target: '_blank', rel: 'noopener', textContent: 'Edit it in a new tab' });
    bdkLive.panel?.querySelector('.bdk-live-status').append(link);
    return;
  }
  const target = document.getElementById(`bdk-section-${section}`);
  if (!target) return;
  bdkLive.section = section;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.bdk-section.bdk-flash').forEach((element) => element.classList.remove('bdk-flash'));
  void target.offsetWidth;
  target.classList.add('bdk-flash');
  target.querySelector('input:not([type="hidden"]), textarea, select')?.focus({ preventScroll: true });
}

jQuery(document).on('click', '#bdk-live-button', () => (bdkLive.panel ? bdkCloseLive() : bdkOpenLive()));
jQuery(document).on('click', '#bdk-live .bdk-live-close', bdkCloseLive);
jQuery(document).on('change', '#bdk-live .bdk-live-device', function () {
  bdkLive.device = this.value;
  bdkLiveFit();
});
jQuery(document).on('input change', '[name^="bdk_copy["], #bdk-preview-target', () => {
  if (!bdkLive.panel) return;
  clearTimeout(bdkLive.timer);
  bdkLive.timer = setTimeout(bdkRefreshLive, 900);
});
jQuery(document).on('focusin', '.bdk-section', function () {
  const section = this.dataset.bdkSection;
  if (!bdkLive.frame || section === bdkLive.section) return;
  bdkLive.section = section;
  bdkLive.frame.contentWindow.postMessage({ type: 'bdk:highlight', record: bdkPreview.record, section }, bdkLiveOrigin());
});
window.addEventListener('message', (event) => {
  if (!bdkLive.panel || event.origin !== bdkLiveOrigin()) return;
  const pending = bdkLive.pending && event.source === bdkLive.pending.contentWindow ? bdkLive.pending : null;
  const current = bdkLive.frame && event.source === bdkLive.frame.contentWindow;
  const data = event.data || {};
  if (pending && data.type === 'bdk:ready') {
    event.source.postMessage({ type: 'bdk:scroll', y: bdkLive.scrollY }, event.origin);
    setTimeout(() => bdkShowFrame(pending, true), 80);
  }
  if (current && data.type === 'bdk:scroll' && typeof data.y === 'number') bdkLive.scrollY = data.y;
  if ((pending || current) && data.type === 'bdk:section' && typeof data.record === 'string' && typeof data.section === 'string') {
    bdkGoToSection(data.record, data.section);
  }
});
