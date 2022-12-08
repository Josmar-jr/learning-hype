import { Spinner } from "phosphor-react";
import type { ButtonHTMLAttributes, ElementType } from "react";
import cln from "classnames";
import { Slot } from "@radix-ui/react-slot";

const customVariants = {
  primary:
    "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-900",
  secondary:
    "bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-800 text-gray-100 border border-zinc-900 hover:bg-zinc-900 focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-200 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-900",
  outlined:
    "bg-gray-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-900",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: keyof typeof customVariants;
  className?: string;
  asChildren?: boolean;
};

export function Button({
  isLoading = false,
  variant = "primary",
  className,
  asChildren,
  ...props
}: ButtonProps) {
  const Component = asChildren ? Slot : "button"

  return (
    <Component
      className={cln(
        "inline-flex items-center justify-center gap-2 rounded-md px-8 py-3 text-sm font-medium tracking-wide outline-none transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:text-[1rem]",
        customVariants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner className="h-5 w-5 animate-spin" />
      ) : (
        props.children
      )}
    </Component>
  );
}
