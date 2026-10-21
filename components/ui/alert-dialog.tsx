"use client";
import * as Dialog from "@radix-ui/react-alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export const AlertDialog = Dialog.Root;
export const AlertDialogTrigger = Dialog.Trigger;
export const AlertDialogCancel = Dialog.Cancel;
export const AlertDialogTitle = Dialog.Title;
export const AlertDialogDescription = Dialog.Description;
export function AlertDialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50" />
      <Dialog.Content
        {...props}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100vw_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl",
          className,
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
