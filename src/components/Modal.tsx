import type { ComponentProps } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import cln from "classnames";
import { X } from "phosphor-react";

export interface ModalProps extends React.ComponentProps<typeof Dialog.Root> {
  overlay?: boolean;
}

export function Modal({ children, overlay = true, ...props }: ModalProps) {
  return (
    <Dialog.Root {...props}>
      {overlay && (
        <Dialog.Overlay className="fixed inset-0 z-20 bg-[#050206] opacity-70" />
      )}

      {children}
    </Dialog.Root>
  );
}

interface ModalWrapperProps extends ComponentProps<typeof Dialog.Content> {
  maintainDimensions?: boolean;
}

export function ModalWrapper({
  maintainDimensions = true,
  ...props
}: ModalWrapperProps) {
  const a = "60px";
  return (
    <Dialog.Content
      {...props}
      className={cln(
        `fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-gray-100 py-6 px-12 text-center text-zinc-400 sm:h-auto sm:w-full sm:rounded-lg sm:max-w-[600px]`,
        {
          ["h-screen w-screen rounded-none"]: maintainDimensions,
        }
      )}
    />
  );
}

export function ModalX() {
  return (
    <Dialog.Close asChild>
      <button className="absolute top-3 right-3 ml-auto rounded-sm p-1 text-xl font-bold outline-none transition-all hover:text-zinc-700 focus:text-zinc-700 focus:ring-2 focus:ring-indigo-500">
        <X />
      </button>
    </Dialog.Close>
  );
}

type ModalTitleProps = ComponentProps<typeof Dialog.Title>;

export function ModalTitle({ ...props }: ModalTitleProps) {
  return (
    <Dialog.Title {...props} className="text-2xl font-bold text-gray-900" />
  );
}

type ModalDescriptionProps = ComponentProps<typeof Dialog.Description>;

export function ModalDescription({ ...props }: ModalDescriptionProps) {
  return <Dialog.Description {...props} className="text-zinc-400" />;
}

export const ModalTrigger = Dialog.DialogTrigger;
export const ModalClose = Dialog.Close;
