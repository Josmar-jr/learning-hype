import type { ComponentProps } from "react";
import { signIn } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./Form/Button";
import { ArrowRight, Fingerprint, GithubLogo } from "phosphor-react";

type ModalCredentialsProps = ComponentProps<typeof Dialog.Root>;

export function ModalCredentials({ ...props }: ModalCredentialsProps) {
  function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    signIn("github");
  }

  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild>
        <Button className="mt-8 w-56 group">
          Iniciar quiz
          <ArrowRight className="group-hover:translate-x-2 ease-linear duration-200" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Overlay className="fixed inset-0 z-20 bg-[#050206] opacity-70" />

      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex h-full w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg bg-gray-100 py-6 px-4 text-center sm:h-auto">
        <span className="mb-6 rounded-full bg-zinc-300 p-4 text-gray-100">
          <Fingerprint size={32} weight="bold" />
        </span>

        <Dialog.Title className="text-2xl font-bold text-gray-900">
          Entre com o Gihub!
        </Dialog.Title>
        <Dialog.Description className="text-zinc-400">
          <p className="py-2">
            É preciso efetuar o login com o Github para realizar o quiz!
          </p>
        </Dialog.Description>

        <form
          onSubmit={handleSignIn}
          className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row-reverse"
        >
          <Button type="submit" className="w-full sm:w-64" variant="secondary">
            <GithubLogo className="h-5 w-5" />
            Entrar com Github
          </Button>
          <Dialog.Close asChild>
            <Button className="w-full sm:w-64" variant="outlined">
              Cancelar
            </Button>
          </Dialog.Close>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
