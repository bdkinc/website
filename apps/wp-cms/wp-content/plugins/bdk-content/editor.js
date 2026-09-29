/* global jQuery, wp */
jQuery(document).on('click', '.bdk-media', function () {
  const target = document.getElementById(this.dataset.target);
  const frame = wp.media({
    title: 'Choose website image',
    multiple: false,
    library: { type: 'image' },
  });
  frame.on('select', () => {
    target.value = frame.state().get('selection').first().toJSON().url;
    target.dispatchEvent(new Event('change', { bubbles: true }));
  });
  frame.open();
});

/* global bdkPreview */
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
