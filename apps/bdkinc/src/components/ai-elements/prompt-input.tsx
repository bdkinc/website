'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@bdkinc/design-system';
import type { ChatStatus, FileUIPart } from 'ai';
import {
  PiImage,
  PiSpinner,
  PiMicrophone,
  PiPaperclip,
  PiPlus,
  PiPaperPlaneRight,
  PiSquare,
  PiX,
} from 'react-icons/pi';
import { nanoid } from 'nanoid';
import {
  type ChangeEvent,
  type ChangeEventHandler,
  Children,
  type ClipboardEventHandler,
  type ComponentProps,
  createContext,
  type FormEvent,
  type FormEventHandler,
  Fragment,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const hoverMedia = '@media (hover: hover)';
const transitionInteractive =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';

const spinKeyframes = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});
const pulseKeyframes = stylex.keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const styles = stylex.create({
  form: { width: '100%' },
  hidden: { display: 'none' },
  body: { display: 'contents' },
  // `field-sizing-content` and `min-h-16` match the InputGroupTextarea
  // primitive defaults, so only the max-height override lives here.
  textarea: { maxHeight: '12rem' },
  // InputGroupAddon supplies the flex row, alignment, color and type;
  // only the properties the original tailwind-merge kept are overridden.
  header: { order: -9999, flexWrap: 'wrap', gap: 4 },
  footer: { justifyContent: 'space-between', gap: 4 },
  tools: { display: 'flex', alignItems: 'center', gap: 4 },
  attachment: {
    position: 'relative',
    display: 'flex',
    height: 32,
    alignItems: 'center',
    gap: 6,
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    cursor: 'default',
    paddingInline: 6,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    userSelect: 'none',
    transitionProperty: transitionInteractive,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
    // Replaces `hover:bg-accent hover:text-accent-foreground
    // dark:hover:bg-accent/50`: the shared ghost token already encodes that
    // exact pair (light `var(--accent)`, dark `accent/50`), so the hover
    // colors stay in sync with the Button ghost variant by construction.
    backgroundColor: {
      default: null,
      [hoverMedia]: { default: null, ':hover': 'var(--button-ghost-hover)' },
    },
    color: {
      default: null,
      [hoverMedia]: { default: null, ':hover': 'var(--accent-foreground)' },
    },
    // Replaces the legacy `group` / `group-hover:` pair: the parent drives
    // `--attach-reveal` on its own hover and the children read it back.
    // The hover stays gated under `(hover: hover)` to match the Tailwind v4
    // `group-hover` behavior (no sticky reveal on touch). `.875rem` /
    // `1.25rem` are the rem equivalents of the original `text-sm` pair.
    '--attach-reveal': {
      default: 0,
      [hoverMedia]: { default: 0, ':hover': 1 },
    },
  },
  attachIconWrap: {
    position: 'relative',
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  attachIconRest: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 'calc(var(--radius) - 4px)',
    backgroundColor: 'var(--background)',
    opacity: 'calc(1 - var(--attach-reveal, 0))',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  attachThumb: { width: 20, height: 20, objectFit: 'cover' },
  attachFileIcon: {
    display: 'flex',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--muted-foreground)',
  },
  // Original `size-5 p-0` intent (20px) expressed against the migrated
  // Button primitive, whose unlayered size defaults utilities can no longer
  // override; the focus-visible ring stays on this same element. The zero
  // uses the same logical longhands as the Button size defaults
  // (`paddingInline`/`paddingBlock`) so the `p-0` override wins
  // deterministically instead of racing them as a shorthand.
  attachRemove: {
    position: 'absolute',
    inset: 0,
    width: 20,
    height: 20,
    minHeight: 20,
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: 'calc(var(--radius) - 4px)',
    cursor: 'pointer',
    opacity: 'var(--attach-reveal, 0)',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  attachLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hoverContent: { width: 'auto', padding: 8 },
  // Replaces `space-y-3` with a flex column gap; children are full-width
  // blocks either way, so the rendered output is unchanged.
  hoverBody: {
    display: 'flex',
    width: 'auto',
    flexDirection: 'column',
    gap: 12,
  },
  hoverPreview: {
    display: 'flex',
    width: '24rem',
    maxHeight: '24rem',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  hoverImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  hoverRow: { display: 'flex', alignItems: 'center', gap: 10 },
  // Replaces `space-y-1` with a flex column gap (see hoverBody).
  hoverMeta: {
    display: 'flex',
    minWidth: 0,
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    paddingInline: 2,
  },
  hoverTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '.875rem',
    lineHeight: 1,
    fontWeight: 600,
  },
  hoverType: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-mono)',
    fontSize: '.75rem',
    lineHeight: '1rem',
  },
  speech: {
    position: 'relative',
    transitionProperty: transitionInteractive,
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  speechListening: {
    backgroundColor: 'var(--accent)',
    color: 'var(--accent-foreground)',
    animationName: pulseKeyframes,
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(.4, 0, .6, 1)',
    animationIterationCount: 'infinite',
  },
  spin: {
    animationName: spinKeyframes,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  modelTrigger: {
    color: {
      default: 'var(--muted-foreground)',
      [hoverMedia]: {
        default: 'var(--muted-foreground)',
        ':hover': 'var(--foreground)',
      },
      '[aria-expanded="true"]': 'var(--foreground)',
    },
    borderStyle: 'none',
    backgroundColor: {
      default: 'transparent',
      [hoverMedia]: { default: 'transparent', ':hover': 'var(--accent)' },
      '[aria-expanded="true"]': 'var(--accent)',
    },
    fontWeight: 500,
    // `shadow-none` also removed the primitive focus ring; both conditions
    // are stated so the ring stays off exactly as before.
    boxShadow: { default: 'none', ':focus-visible': 'none' },
    transitionProperty:
      'color, background-color, border-color, text-decoration-color, fill, stroke',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  tabLabel: {
    marginBottom: 8,
    paddingInline: 12,
    color: 'var(--muted-foreground)',
    fontSize: '.75rem',
    lineHeight: '1rem',
    fontWeight: 500,
  },
  // Replaces `space-y-1` with a flex column gap (see hoverBody).
  tabBody: { display: 'flex', flexDirection: 'column', gap: 4 },
  tabItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingInline: 12,
    paddingBlock: 8,
    fontSize: '.75rem',
    lineHeight: '1rem',
    backgroundColor: {
      default: null,
      [hoverMedia]: { default: null, ':hover': 'var(--accent)' },
    },
  },
  icon10: { width: 10, height: 10 },
  icon12: { width: 12, height: 12 },
  icon16: { width: 16, height: 16 },
  iconAction: { marginRight: 8, width: 16, height: 16 },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderWidth: 0,
    clipPath: 'inset(50%)',
  },
});

// ============================================================================
// Provider Context & Types
// ============================================================================

export type AttachmentsContext = {
  files: (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type TextInputContext = {
  value: string;
  setInput: (v: string) => void;
  clear: () => void;
};

export type PromptInputControllerProps = {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  /** INTERNAL: Allows PromptInput to register its file textInput + "open" callback */
  __registerFileInput: (
    ref: RefObject<HTMLInputElement | null>,
    open: () => void
  ) => void;
};

const PromptInputController = createContext<PromptInputControllerProps | null>(
  null
);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(
  null
);

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use usePromptInputController().'
    );
  }
  return ctx;
};

// Optional variants (do NOT throw). Useful for dual-mode components.
const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use useProviderAttachments().'
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export function PromptInputProvider({
  initialInput: initialTextInput = '',
  children,
}: PromptInputProviderProps) {
  // ----- textInput state
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(''), []);

  // ----- attachments state (global when wrapped)
  const [attachements, setAttachements] = useState<
    (FileUIPart & { id: string })[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openRef = useRef<() => void>(() => {});

  const add = useCallback((files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    setAttachements((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: nanoid(),
          type: 'file' as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        }))
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAttachements((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) URL.revokeObjectURL(found.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachements((prev) => {
      for (const f of prev) if (f.url) URL.revokeObjectURL(f.url);
      return [];
    });
  }, []);

  const openFileDialog = useCallback(() => {
    openRef.current?.();
  }, []);

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      files: attachements,
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef,
    }),
    [attachements, add, remove, clear, openFileDialog]
  );

  const __registerFileInput = useCallback(
    (ref: RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current;
      openRef.current = open;
    },
    []
  );

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      textInput: {
        value: textInput,
        setInput: setTextInput,
        clear: clearInput,
      },
      attachments,
      __registerFileInput,
    }),
    [textInput, clearInput, attachments, __registerFileInput]
  );

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
}

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputAttachments = () => {
  // Dual-mode: prefer provider if present, otherwise use local
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = provider ?? local;
  if (!context) {
    throw new Error(
      'usePromptInputAttachments must be used within a PromptInput or PromptInputProvider'
    );
  }
  return context;
};

export type PromptInputAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart & { id: string };
  className?: string;
  xstyle?: StyleXStyles;
};

export function PromptInputAttachment({
  data,
  className,
  style,
  xstyle,
  ...props
}: PromptInputAttachmentProps) {
  const attachments = usePromptInputAttachments();

  const filename = data.filename || '';

  const mediaType =
    data.mediaType?.startsWith('image/') && data.url ? 'image' : 'file';
  const isImage = mediaType === 'image';

  const attachmentLabel = filename || (isImage ? 'Image' : 'Attachment');
  const applied = stylex.props(styles.attachment, xstyle);

  return (
    <PromptInputHoverCard>
      <HoverCardTrigger asChild>
        <div
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          key={data.id}
          {...props}
        >
          <div {...stylex.props(styles.attachIconWrap)}>
            <div {...stylex.props(styles.attachIconRest)}>
              {isImage ? (
                <img
                  alt={filename || 'attachment'}
                  height={20}
                  src={data.url}
                  width={20}
                  {...stylex.props(styles.attachThumb)}
                />
              ) : (
                <div {...stylex.props(styles.attachFileIcon)}>
                  <PiPaperclip {...stylex.props(styles.icon12)} />
                </div>
              )}
            </div>
            <Button
              aria-label="Remove attachment"
              xstyle={styles.attachRemove}
              onClick={(e) => {
                e.stopPropagation();
                attachments.remove(data.id);
              }}
              type="button"
              variant="ghost"
            >
              <PiX {...stylex.props(styles.icon10)} />
              <span {...stylex.props(styles.srOnly)}>Remove</span>
            </Button>
          </div>

          <span {...stylex.props(styles.attachLabel)}>{attachmentLabel}</span>
        </div>
      </HoverCardTrigger>
      <PromptInputHoverCardContent xstyle={styles.hoverContent}>
        <div {...stylex.props(styles.hoverBody)}>
          {isImage && (
            <div {...stylex.props(styles.hoverPreview)}>
              <img
                alt={filename || 'attachment preview'}
                height={384}
                src={data.url}
                width={448}
                {...stylex.props(styles.hoverImage)}
              />
            </div>
          )}
          <div {...stylex.props(styles.hoverRow)}>
            <div {...stylex.props(styles.hoverMeta)}>
              <h4 {...stylex.props(styles.hoverTitle)}>
                {filename || (isImage ? 'Image' : 'Attachment')}
              </h4>
              {data.mediaType && (
                <p {...stylex.props(styles.hoverType)}>{data.mediaType}</p>
              )}
            </div>
          </div>
        </div>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}

export type PromptInputAttachmentsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: (attachment: FileUIPart & { id: string }) => ReactNode;
};

export function PromptInputAttachments({
  children,
}: PromptInputAttachmentsProps) {
  const attachments = usePromptInputAttachments();

  if (!attachments.files.length) {
    return null;
  }

  return attachments.files.map((file) => (
    <Fragment key={file.id}>{children(file)}</Fragment>
  ));
}

export type PromptInputActionAddAttachmentsProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string;
};

export const PromptInputActionAddAttachments = ({
  label = 'Add photos or files',
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments();

  return (
    <DropdownMenuItem
      {...props}
      onSelect={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      <PiImage {...stylex.props(styles.iconAction)} /> {label}
    </DropdownMenuItem>
  );
};

export type PromptInputMessage = {
  text?: string;
  files?: FileUIPart[];
};

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onError'
> & {
  accept?: string; // e.g., "image/*" or leave undefined for any
  multiple?: boolean;
  // When true, accepts drops anywhere on document. Default false (opt-in).
  globalDrop?: boolean;
  // Render a hidden input with given name and keep it in sync for native form posts. Default false.
  syncHiddenInput?: boolean;
  // Minimal constraints
  maxFiles?: number;
  maxFileSize?: number; // bytes
  onError?: (err: {
    code: 'max_files' | 'max_file_size' | 'accept';
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  xstyle?: StyleXStyles;
  /**
   * StyleX override for the inner InputGroup boundary. The group renders
   * chromeless here (the form owns border/background/ring), which Tailwind
   * expressed as ancestor `[&_[data-slot=input-group]]:*` selectors that
   * StyleX cannot address across elements.
   */
  groupXstyle?: StyleXStyles;
};

export const PromptInput = ({
  className,
  style,
  xstyle,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  groupXstyle,
  ...props
}: PromptInputProps) => {
  // Try to use a provider controller if present
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  // Refs
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Find nearest form to scope drag & drop
  useEffect(() => {
    const root = anchorRef.current?.closest('form');
    if (root instanceof HTMLFormElement) {
      formRef.current = root;
    }
  }, []);

  // ----- Local attachments (only used when no provider)
  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === '') {
        return true;
      }
      if (accept.includes('image/*')) {
        return f.type.startsWith('image/');
      }
      // NOTE: keep simple; expand as needed
      return true;
    },
    [accept]
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = Array.from(fileList);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: 'accept',
          message: 'No files match the accepted types.',
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: 'max_file_size',
          message: 'All files exceed the maximum size.',
        });
        return;
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === 'number'
            ? Math.max(0, maxFiles - prev.length)
            : undefined;
        const capped =
          typeof capacity === 'number' ? sized.slice(0, capacity) : sized;
        if (typeof capacity === 'number' && sized.length > capacity) {
          onError?.({
            code: 'max_files',
            message: 'Too many files. Some were not added.',
          });
        }
        const next: (FileUIPart & { id: string })[] = [];
        for (const file of capped) {
          next.push({
            id: nanoid(),
            type: 'file',
            url: URL.createObjectURL(file),
            mediaType: file.type,
            filename: file.name,
          });
        }
        return prev.concat(next);
      });
    },
    [matchesAccept, maxFiles, maxFileSize, onError]
  );

  const add = useMemo(
    () =>
      usingProvider
        ? (files: File[] | FileList) => controller.attachments.add(files)
        : addLocal,
    [usingProvider, controller, addLocal]
  );

  const remove = useMemo(
    () =>
      usingProvider
        ? (id: string) => controller.attachments.remove(id)
        : (id: string) =>
            setItems((prev) => {
              const found = prev.find((file) => file.id === id);
              if (found?.url) {
                URL.revokeObjectURL(found.url);
              }
              return prev.filter((file) => file.id !== id);
            }),
    [usingProvider, controller]
  );

  const clear = useMemo(
    () =>
      usingProvider
        ? () => controller.attachments.clear()
        : () =>
            setItems((prev) => {
              for (const file of prev) {
                if (file.url) {
                  URL.revokeObjectURL(file.url);
                }
              }
              return [];
            }),
    [usingProvider, controller]
  );

  const openFileDialog = useMemo(
    () =>
      usingProvider
        ? () => controller.attachments.openFileDialog()
        : openFileDialogLocal,
    [usingProvider, controller, openFileDialogLocal]
  );

  // Let provider know about our hidden file input so external menus can call openFileDialog()
  useEffect(() => {
    if (!usingProvider) return;
    controller.__registerFileInput(inputRef, () => inputRef.current?.click());
  }, [usingProvider, controller]);

  // Note: File input cannot be programmatically set for security reasons
  // The syncHiddenInput prop is no longer functional
  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = '';
    }
  }, [files, syncHiddenInput]);

  // Attach drop handlers on nearest form and document (opt-in)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener('dragover', onDragOver);
    form.addEventListener('drop', onDrop);
    return () => {
      form.removeEventListener('dragover', onDragOver);
      form.removeEventListener('drop', onDrop);
    };
  }, [add]);

  useEffect(() => {
    if (!globalDrop) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, [add, globalDrop]);

  useEffect(
    () => () => {
      if (!usingProvider) {
        for (const f of files) {
          if (f.url) URL.revokeObjectURL(f.url);
        }
      }
    },
    [usingProvider, files]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files) {
      add(event.currentTarget.files);
    }
  };

  const convertBlobUrlToDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const ctx = useMemo<AttachmentsContext>(
    () => ({
      files: files.map((item) => ({ ...item, id: item.id })),
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef: inputRef,
    }),
    [files, add, remove, clear, openFileDialog]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const text = usingProvider
      ? controller.textInput.value
      : (() => {
          const formData = new FormData(form);
          return (formData.get('message') as string) || '';
        })();

    // Reset form immediately after capturing text to avoid race condition
    // where user input during async blob conversion would be lost
    if (!usingProvider) {
      form.reset();
    }

    // Convert blob URLs to data URLs asynchronously
    Promise.all(
      files.map(async ({ id: _id, ...item }) => {
        if (item.url && item.url.startsWith('blob:')) {
          return {
            ...item,
            url: await convertBlobUrlToDataUrl(item.url),
          };
        }
        return item;
      })
    ).then((convertedFiles: FileUIPart[]) => {
      try {
        const result = onSubmit({ text, files: convertedFiles }, event);

        // Handle both sync and async onSubmit
        if (result instanceof Promise) {
          result
            .then(() => {
              clear();
              if (usingProvider) {
                controller.textInput.clear();
              }
            })
            .catch(() => {
              // Don't clear on error - user may want to retry
            });
        } else {
          // Sync function completed without throwing, clear attachments
          clear();
          if (usingProvider) {
            controller.textInput.clear();
          }
        }
      } catch {
        // Don't clear on error - user may want to retry
      }
    });
  };

  // Render with or without local provider
  const formApplied = stylex.props(styles.form, xstyle);
  const inner = (
    <>
      <span
        aria-hidden="true"
        ref={anchorRef}
        {...stylex.props(styles.hidden)}
      />
      <input
        accept={accept}
        aria-label="Upload files"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        title="Upload files"
        type="file"
        {...stylex.props(styles.hidden)}
      />
      <form
        {...formApplied}
        className={cn(formApplied.className, className)}
        style={{ ...formApplied.style, ...style }}
        onSubmit={handleSubmit}
        {...props}
      >
        <InputGroup xstyle={groupXstyle}>{children}</InputGroup>
      </form>
    </>
  );

  return usingProvider ? (
    inner
  ) : (
    <LocalAttachmentsContext.Provider value={ctx}>
      {inner}
    </LocalAttachmentsContext.Provider>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputBody = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputBodyProps) => {
  const applied = stylex.props(styles.body, xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputTextareaProps = ComponentProps<
  typeof InputGroupTextarea
>;

export const PromptInputTextarea = ({
  onChange,
  className,
  xstyle,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (isComposing || e.nativeEvent.isComposing) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }

    // Remove last attachment when Backspace is pressed and textarea is empty
    if (
      e.key === 'Backspace' &&
      e.currentTarget.value === '' &&
      attachments.files.length > 0
    ) {
      e.preventDefault();
      const lastAttachment = attachments.files.at(-1);
      if (lastAttachment) {
        attachments.remove(lastAttachment.id);
      }
    }
  };

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
    const items = event.clipboardData?.items;

    if (!items) {
      return;
    }

    const files: File[] = [];

    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      attachments.add(files);
    }
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(e.currentTarget.value);
          onChange?.(e);
        },
      }
    : {
        onChange,
      };

  return (
    <InputGroupTextarea
      className={className}
      name="message"
      xstyle={[styles.textarea, xstyle]}
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      {...props}
      {...controlledProps}
    />
  );
};

export type PromptInputHeaderProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>;

export const PromptInputHeader = ({
  className,
  xstyle,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon
    align="block-end"
    className={className}
    xstyle={[styles.header, xstyle]}
    {...props}
  />
);

export type PromptInputFooterProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>;

export const PromptInputFooter = ({
  className,
  xstyle,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align="block-end"
    className={className}
    xstyle={[styles.footer, xstyle]}
    {...props}
  />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTools = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputToolsProps) => {
  const applied = stylex.props(styles.tools, xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputButtonProps = ComponentProps<typeof InputGroupButton>;

export const PromptInputButton = ({
  variant = 'ghost',
  className,
  size,
  xstyle,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    size ?? (Children.count(props.children) > 1 ? 'sm' : 'icon-sm');

  return (
    <InputGroupButton
      className={className}
      size={newSize}
      type="button"
      variant={variant}
      xstyle={xstyle}
      {...props}
    />
  );
};

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
);

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger = ({
  className,
  xstyle,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger asChild>
    <PromptInputButton className={className} xstyle={xstyle} {...props}>
      {children ?? <PiPlus {...stylex.props(styles.icon16)} />}
    </PromptInputButton>
  </DropdownMenuTrigger>
);

export type PromptInputActionMenuContentProps = ComponentProps<
  typeof DropdownMenuContent
>;
export const PromptInputActionMenuContent = ({
  className,
  xstyle,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent
    align="start"
    className={className}
    xstyle={xstyle}
    {...props}
  />
);

export type PromptInputActionMenuItemProps = ComponentProps<
  typeof DropdownMenuItem
>;
export const PromptInputActionMenuItem = ({
  className,
  xstyle,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={className} xstyle={xstyle} {...props} />
);

// Note: Actions that perform side-effects (like opening a file dialog)
// are provided in opt-in modules (e.g., prompt-input-attachments).

export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
  status?: ChatStatus;
};

export const PromptInputSubmit = ({
  className,
  xstyle,
  variant = 'default',
  size = 'icon-sm',
  status,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <PiPaperPlaneRight {...stylex.props(styles.icon16)} />;

  if (status === 'submitted') {
    Icon = <PiSpinner {...stylex.props(styles.icon16, styles.spin)} />;
  } else if (status === 'streaming') {
    Icon = <PiSquare {...stylex.props(styles.icon16)} />;
  } else if (status === 'error') {
    Icon = <PiX {...stylex.props(styles.icon16)} />;
  }

  return (
    <InputGroupButton
      aria-label="Submit"
      className={className}
      size={size}
      type="submit"
      variant={variant}
      xstyle={xstyle}
      {...props}
    >
      {children ?? Icon}
    </InputGroupButton>
  );
};

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror:
    ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

type SpeechRecognitionResultList = {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionResult = {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
};

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export type PromptInputSpeechButtonProps = ComponentProps<
  typeof PromptInputButton
> & {
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onTranscriptionChange?: (text: string) => void;
};

export const PromptInputSpeechButton = ({
  className,
  xstyle,
  textareaRef,
  onTranscriptionChange,
  ...props
}: PromptInputSpeechButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();

      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onresult = (event) => {
        let finalTranscript = '';

        const results = Array.from(event.results);

        for (const result of results) {
          if (result.isFinal) {
            finalTranscript += result[0]?.transcript ?? '';
          }
        }

        if (finalTranscript && textareaRef?.current) {
          const textarea = textareaRef.current;
          const currentValue = textarea.value;
          const newValue =
            currentValue + (currentValue ? ' ' : '') + finalTranscript;

          textarea.value = newValue;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          onTranscriptionChange?.(newValue);
        }
      };

      speechRecognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = speechRecognition;
      setRecognition(speechRecognition);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [textareaRef, onTranscriptionChange]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, isListening]);

  return (
    <PromptInputButton
      className={className}
      xstyle={[styles.speech, isListening && styles.speechListening, xstyle]}
      disabled={!recognition}
      onClick={toggleListening}
      {...props}
    >
      <PiMicrophone {...stylex.props(styles.icon16)} />
    </PromptInputButton>
  );
};

export type PromptInputModelSelectProps = ComponentProps<typeof Select>;

export const PromptInputModelSelect = (props: PromptInputModelSelectProps) => (
  <Select {...props} />
);

export type PromptInputModelSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

export const PromptInputModelSelectTrigger = ({
  className,
  xstyle,
  ...props
}: PromptInputModelSelectTriggerProps) => (
  <SelectTrigger
    className={className}
    xstyle={[styles.modelTrigger, xstyle]}
    {...props}
  />
);

export type PromptInputModelSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const PromptInputModelSelectContent = ({
  className,
  xstyle,
  ...props
}: PromptInputModelSelectContentProps) => (
  <SelectContent className={className} xstyle={xstyle} {...props} />
);

export type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputModelSelectItem = ({
  className,
  xstyle,
  ...props
}: PromptInputModelSelectItemProps) => (
  <SelectItem className={className} xstyle={xstyle} {...props} />
);

export type PromptInputModelSelectValueProps = ComponentProps<
  typeof SelectValue
>;

export const PromptInputModelSelectValue = ({
  className,
  ...props
}: PromptInputModelSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
);

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

export type PromptInputHoverCardTriggerProps = ComponentProps<
  typeof HoverCardTrigger
>;

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps
) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = ComponentProps<
  typeof HoverCardContent
>;

export const PromptInputHoverCardContent = ({
  align = 'start',
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent align={align} {...props} />
);

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTabsList = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputTabsListProps) => {
  const applied = stylex.props(xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTab = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputTabProps) => {
  const applied = stylex.props(xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTabLabel = ({
  className,
  style,
  xstyle,
  children,
  ...props
}: PromptInputTabLabelProps) => {
  const applied = stylex.props(styles.tabLabel, xstyle);
  return (
    <h3
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}
    </h3>
  );
};

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTabBody = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputTabBodyProps) => {
  const applied = stylex.props(styles.tabBody, xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement> & {
  xstyle?: StyleXStyles;
};

export const PromptInputTabItem = ({
  className,
  style,
  xstyle,
  ...props
}: PromptInputTabItemProps) => {
  const applied = stylex.props(styles.tabItem, xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type PromptInputCommandProps = ComponentProps<typeof Command>;

export const PromptInputCommand = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandProps) => (
  <Command className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>;

export const PromptInputCommandInput = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandInputProps) => (
  <CommandInput className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>;

export const PromptInputCommandList = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandListProps) => (
  <CommandList className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>;

export const PromptInputCommandEmpty = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandEmptyProps) => (
  <CommandEmpty className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>;

export const PromptInputCommandGroup = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandGroupProps) => (
  <CommandGroup className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>;

export const PromptInputCommandItem = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandItemProps) => (
  <CommandItem className={className} xstyle={xstyle} {...props} />
);

export type PromptInputCommandSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const PromptInputCommandSeparator = ({
  className,
  xstyle,
  ...props
}: PromptInputCommandSeparatorProps) => (
  <CommandSeparator className={className} xstyle={xstyle} {...props} />
);
