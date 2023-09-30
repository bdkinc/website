import * as Dialog from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { FaTimes } from "react-icons/fa";

const MyDialog = forwardRef(({ children, ...props }, ref) => {
  return (
    <Dialog.Root ref={ref} {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className={"bg-black/50 fixed inset-0"} />
        <Dialog.Content className="focus:outline-none bg-white -translate-x-1/2 -translate-y-1/2 dark:bg-slate-800 shadow-lg fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] max-h-[85vh] p-6">
          {children}
          <Dialog.Close asChild>
            <button>
              <FaTimes />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

const Trigger = forwardRef(({ children, ...props }, ref) => {
  return (
    <Dialog.Trigger ref={ref} {...props}>
      {children}
    </Dialog.Trigger>
  );
});

const Title = forwardRef(({ children, ...props }, ref) => {
  return (
    <Dialog.Title ref={ref} {...props}>
      {children}
    </Dialog.Title>
  );
});

export default Object.assign(MyDialog, { ...Dialog, Trigger, Title });
