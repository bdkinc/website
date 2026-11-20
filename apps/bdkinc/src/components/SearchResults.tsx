import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PiMagnifyingGlass } from 'react-icons/pi';
import { Button } from '@bdkinc/design-system';
import type { SearchEntry, SearchKind } from '@/lib/search';

export interface SearchResultsProps {
  /** Base-aware URL of the static index; fetched only once a query runs. */
  indexUrl: string;
  /** Base-aware URL of this page, used for the no-JS form action and query URLs. */
  searchUrl: string;
  /** Base URL prefix for canonical result paths. */
  base: string;
}

const kindLabels: Record<SearchKind, string> = {
  page: 'Page',
  'blog-post': 'Blog',
  'service-location': 'Local service',
  'industry-location': 'Industry',
};
// Main pages and articles outrank the many location variants of the same topic.
const kindWeight: Record<SearchKind, number> = {
  page: 3,
  'blog-post': 2,
  'service-location': 0,
  'industry-location': 0,
};
const PAGE_SIZE = 20;

interface Prepared {
  entry: SearchEntry;
  order: number;
  title: string;
  path: string;
  body: string;
}

type IndexState =
  | { status: 'idle' | 'loading' | 'error' }
  | { status: 'ready'; entries: Prepared[] };

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const padded = (value: string) => ` ${normalize(value)} `;

function prepare(entries: SearchEntry[]): Prepared[] {
  return entries.map((entry, order) => ({
    entry,
    order,
    title: padded(entry.title),
    path: padded(entry.path),
    body: padded(`${entry.description} ${entry.keywords ?? ''}`),
  }));
}

/** Every term must start a word somewhere; title hits and main pages rank first. */
function rank(entries: Prepared[], terms: string[]): SearchEntry[] {
  const phrase = terms.join(' ');
  const scored: { item: Prepared; score: number }[] = [];
  for (const item of entries) {
    let score = kindWeight[item.entry.kind];
    let matched = true;
    for (const term of terms) {
      const start = ` ${term}`;
      if (item.title.includes(`${start} `)) score += 6;
      else if (item.title.includes(start)) score += 4;
      else if (item.path.includes(start)) score += 2;
      else if (item.body.includes(start)) score += 1;
      else {
        matched = false;
        break;
      }
    }
    if (!matched) continue;
    if (item.title === ` ${phrase} `) score += 10;
    else if (terms.length > 1 && item.title.includes(` ${phrase}`)) score += 6;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
    .map(({ item }) => item.entry);
}

function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`\\b(${escaped.join('|')})`, 'gi'));
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} {...stylex.props(styles.mark)}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function readQuery(): string {
  return new URLSearchParams(window.location.search).get('q') ?? '';
}

const trimPath = (path: string) => path.replace(/\/+$/, '') || '/';

/**
 * Called synchronously from user edits only: rewrites just `q` on the current entry,
 * keeping other params, the hash and ClientRouter's history.state. Never writes once
 * the current entry is no longer the search page (e.g. mid Back traversal).
 */
function writeQuery(searchUrl: string, query: string) {
  const url = new URL(window.location.href);
  if (trimPath(url.pathname) !== trimPath(new URL(searchUrl, url).pathname)) return;
  const trimmed = query.trim();
  if (trimmed) url.searchParams.set('q', trimmed);
  else url.searchParams.delete('q');
  if (url.href === window.location.href) return;
  try {
    window.history.replaceState(window.history.state, '', url);
  } catch {
    // Browsers may throttle rapid replaceState; the next edit or submit retries.
  }
}

let indexRequest: Promise<Prepared[]> | undefined;
function loadIndex(indexUrl: string): Promise<Prepared[]> {
  indexRequest ??= fetch(indexUrl, { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Search index is malformed.');
      // Preparing inside the request keeps malformed entries on the retryable error path.
      return prepare(data as SearchEntry[]);
    })
    .catch((error: unknown) => {
      indexRequest = undefined;
      throw error;
    });
  return indexRequest;
}

export default function SearchResults({
  indexUrl,
  searchUrl,
  base,
}: SearchResultsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<IndexState>({ status: 'idle' });
  const [limit, setLimit] = useState(PAGE_SIZE);

  const trimmed = query.trim();
  const terms = useMemo(() => normalize(query).split(' ').filter(Boolean), [query]);
  const results = useMemo(
    () => (index.status === 'ready' && terms.length ? rank(index.entries, terms) : []),
    [index, terms]
  );

  // Restore a bookmarked or shared ?q= once the static page hydrates.
  useEffect(() => {
    const initial = readQuery();
    setQuery(initial);
    setMounted(true);
    if (!initial) inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!terms.length || index.status !== 'idle') return;
    setIndex({ status: 'loading' });
    loadIndex(indexUrl).then(
      (entries) => setIndex({ status: 'ready', entries }),
      () => setIndex({ status: 'error' })
    );
  }, [terms.length, index.status, indexUrl]);

  const edit = (value: string) => {
    setQuery(value);
    setLimit(PAGE_SIZE);
    writeQuery(searchUrl, value);
  };

  const quoted = `“${trimmed}”`;
  let status = '';
  if (mounted && terms.length) {
    if (index.status === 'loading' || index.status === 'idle') status = 'Searching…';
    else if (index.status === 'error') status = 'Search is unavailable right now.';
    else if (results.length)
      status = `${results.length} ${results.length === 1 ? 'result' : 'results'} for ${quoted}`;
    else status = `No matches for ${quoted}`;
  }

  return (
    <div {...stylex.props(styles.root)}>
      <form
        role="search"
        action={searchUrl}
        method="get"
        onSubmit={(event) => {
          event.preventDefault();
          writeQuery(searchUrl, query);
        }}
      >
        <label htmlFor="site-search-input" {...stylex.props(styles.srOnly)}>
          Search this site
        </label>
        <div {...stylex.props(styles.field)}>
          <PiMagnifyingGlass {...stylex.props(styles.fieldIcon)} aria-hidden="true" />
          <input
            ref={inputRef}
            id="site-search-input"
            type="search"
            name="q"
            value={query}
            onChange={(event) => edit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                edit('');
              }
            }}
            placeholder="Services, topics, or locations"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-describedby="site-search-status"
            {...stylex.props(styles.input)}
          />
          <Button type="submit" xstyle={styles.submit}>
            Search
          </Button>
        </div>
      </form>

      <p
        id="site-search-status"
        role="status"
        aria-live="polite"
        {...stylex.props(styles.status, !status && styles.srOnly)}
      >
        {status}
      </p>

      {mounted && !terms.length && (
        <p {...stylex.props(styles.panelText)}>
          Search across our services, local service areas, industries, and blog posts.
        </p>
      )}

      {index.status === 'error' && terms.length > 0 && (
        <section {...stylex.props(styles.panel)}>
          <p {...stylex.props(styles.panelText)}>
            We couldn&rsquo;t load search results. Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIndex({ status: 'idle' })}
          >
            Try again
          </Button>
        </section>
      )}

      {index.status === 'ready' && terms.length > 0 && results.length === 0 && (
        <section aria-labelledby="search-empty-heading" {...stylex.props(styles.panel)}>
          <h2 id="search-empty-heading" {...stylex.props(styles.panelHeading)}>
            Nothing matched {quoted}
          </h2>
          <p {...stylex.props(styles.panelText)}>
            Check the spelling, use fewer words, or try a service name or town.
          </p>
        </section>
      )}

      {results.length > 0 && (
        <>
          <ol {...stylex.props(styles.results)}>
            {results.slice(0, limit).map((entry) => (
              <li key={entry.path} {...stylex.props(styles.result)}>
                <p {...stylex.props(styles.meta)}>
                  <span {...stylex.props(styles.kind)}>{kindLabels[entry.kind]}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span {...stylex.props(styles.path)}>{entry.path}</span>
                </p>
                <h2 {...stylex.props(styles.resultTitle)}>
                  <a
                    href={`${base}${entry.path.replace(/^\//, '')}`}
                    {...stylex.props(styles.resultLink)}
                  >
                    {highlight(entry.title, terms)}
                  </a>
                </h2>
                {entry.description && (
                  <p {...stylex.props(styles.description)}>
                    {highlight(entry.description, terms)}
                  </p>
                )}
              </li>
            ))}
          </ol>
          {results.length > limit && (
            <Button
              type="button"
              variant="outline"
              xstyle={styles.more}
              onClick={() => setLimit((current) => current + PAGE_SIZE)}
            >
              Show more results ({results.length - limit} remaining)
            </Button>
          )}
        </>
      )}
    </div>
  );
}

const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 24 },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 60,
    paddingInlineStart: 16,
    paddingInlineEnd: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'var(--input)', ':focus-within': 'var(--ring)' },
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--card)',
    boxShadow: {
      default: '0 10px 30px -18px rgb(0 0 0 / 0.35)',
      ':focus-within': '0 0 0 3px var(--field-focus-ring)',
    },
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: ease,
  },
  fieldIcon: { width: 22, height: 22, flexShrink: 0, color: 'var(--primary)' },
  input: {
    flex: '1',
    minWidth: 0,
    height: 44,
    paddingInline: 4,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    outline: 'none',
    '::placeholder': { color: 'var(--muted-foreground)' },
  },
  submit: { flexShrink: 0 },
  status: {
    margin: 0,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontVariantNumeric: 'tabular-nums',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 8,
  },
  panelHeading: {
    margin: 0,
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: 1.375,
    fontWeight: 700,
    letterSpacing: '-.025em',
  },
  panelText: {
    margin: 0,
    maxWidth: '40rem',
    color: 'var(--muted-foreground)',
    lineHeight: 1.625,
  },
  results: { margin: 0, padding: 0, listStyle: 'none' },
  result: {
    position: 'relative',
    paddingBlock: 20,
    paddingInline: 12,
    marginInline: -12,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--border) 60%, transparent)',
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: {
      default: 'transparent',
      ':hover': {
        default: null,
        '@media (hover: hover)': 'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
    transitionTimingFunction: ease,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    margin: 0,
    marginBottom: 4,
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  kind: { color: 'var(--primary)', fontWeight: 600 },
  path: { overflowWrap: 'anywhere' },
  resultTitle: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: '1.125rem',
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: '-.015em',
  },
  // The stretched ::after makes the whole row one click target with one tab stop.
  resultLink: {
    color: {
      default: 'var(--foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      ':focus-visible': 'var(--primary)',
    },
    textDecoration: { default: 'none', ':focus-visible': 'underline' },
    textUnderlineOffset: 4,
    outline: { default: 'none', ':focus-visible': '2px solid var(--ring)' },
    outlineOffset: 4,
    borderRadius: 2,
    transitionProperty: 'color',
    transitionDuration: '150ms',
    '::after': { content: '""', position: 'absolute', inset: 0 },
  },
  description: {
    margin: 0,
    marginTop: 6,
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    color: 'var(--muted-foreground)',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
  },
  mark: {
    backgroundColor: 'transparent',
    color: 'inherit',
    fontWeight: 700,
    textDecorationLine: 'underline',
    textDecorationColor: 'color-mix(in oklab, var(--accent) 70%, transparent)',
    textDecorationThickness: 2,
    textUnderlineOffset: 3,
  },
  more: { alignSelf: 'center' },
});
