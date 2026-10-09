import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { serializeSchema } from '../src/lib/schema.ts';

test('JSON-LD cannot close its containing script', () => {
  const input = { description: '</script><script>alert(1)</script>' };
  const output = serializeSchema(input);
  assert.equal(output.includes('<'), false);
  assert.deepEqual(JSON.parse(output), input);
});

test('analytics respects consent, scrubs queries, and counts Astro navigation once', async () => {
  const file = await readFile(
    new URL('../src/components/MarketingAnalytics.astro', import.meta.url),
    'utf8'
  );
  const script = ts.transpileModule(
    file.match(/<script>([\s\S]*?)<\/script>/)[1],
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } }
  ).outputText;
  const listeners = new Map(),
    buttons = new Map(),
    storage = new Map(),
    loaded = [];
  const panel = { hidden: true };
  const root = {
    dataset: { id: 'G-TEST' },
    querySelector(selector) {
      if (selector === '[data-analytics-choice]') return panel;
      return {
        addEventListener(event, callback) {
          buttons.set(selector, callback);
        },
      };
    },
  };
  let present = true;
  class Element {
    closest() {
      return { href: 'mailto:private@example.test' };
    }
  }
  const document = {
    title: 'Marketing page',
    querySelector() {
      return present ? root : null;
    },
    addEventListener(event, callback) {
      listeners.set(event, callback);
    },
    createElement() {
      return {};
    },
    head: {
      append(element) {
        loaded.push(element);
      },
    },
  };
  const window = {
    addEventListener(event, callback) {
      listeners.set(event, callback);
    },
  };
  const location = {
    origin: 'https://www.bdkinc.com',
    pathname: '/contact',
    search:
      '?email=private@example.test&token=private-token&utm_campaign=it-consultation&utm_source=private@example.test',
  };
  vm.runInNewContext(script, {
    document,
    window,
    location,
    URL,
    URLSearchParams,
    Element,
    localStorage: {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, value);
      },
    },
  });
  assert.equal(loaded.length, 0);
  assert.equal(panel.hidden, false);
  buttons.get('[data-analytics-deny]')();
  assert.equal(loaded.length, 0);
  buttons.get('[data-analytics-allow]')();
  assert.equal(loaded.length, 1);
  const events = () =>
    window.dataLayer
      .map((item) => Array.from(item))
      .filter((item) => item[0] === 'event');
  assert.equal(events().length, 1);
  const page = events()[0][2];
  assert.equal(
    page.page_location,
    'https://www.bdkinc.com/contact?utm_campaign=it-consultation'
  );
  assert.equal(page.page_referrer, '');
  listeners.get('click')({ target: new Element() });
  assert.equal(events()[1][2].contact_method, 'email');
  assert.equal(JSON.stringify(events()).includes('private'), false);
  listeners.get('contact-chat:analytics')({
    detail: {
      event: 'contact_chat_message_sent',
      params: { method: 'typed', char_count: 10, text: 'private conversation' },
    },
  });
  assert.equal(events()[2][2].char_count, 10);
  assert.equal(JSON.stringify(events()).includes('private'), false);
  listeners.get('astro:page-load')();
  assert.equal(events().length, 3);
  location.pathname = '/services';
  location.search = '';
  listeners.get('astro:page-load')();
  assert.equal(events().length, 4);
  assert.equal(loaded.length, 1);
  buttons.get('[data-analytics-deny]')();
  listeners.get('click')({ target: new Element() });
  assert.equal(events().length, 4);
  assert.equal(window['ga-disable-G-TEST'], true);
  present = false;
  listeners.get('astro:page-load')();
  assert.equal(window['ga-disable-G-TEST'], true);
});
