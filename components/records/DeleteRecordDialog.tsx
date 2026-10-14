"use client";
import { useActionState, useState } from "react";
import { deleteRecord } from "@/app/records/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
export default function DeleteRecordDialog({
  id,
  title,
  version,
  page,
}: {
  id: string;
  title: string;
  version: string;
  page: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteRecord, {
    message: "",
  });
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="text-red-700 hover:bg-red-50">
          기록 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <AlertDialogTitle className="text-xl font-bold">
          이 기록을 삭제할까요?
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-3 break-words text-sm leading-relaxed text-slate-600">
          ‘{title}’ 기록과 연결된 사진을 삭제합니다. 삭제한 기록은 되돌릴 수
          없습니다.
        </AlertDialogDescription>
        <form action={action} aria-busy={pending} className="mt-6">
          <input type="hidden" name="record_id" value={id} />
          <input type="hidden" name="expected_updated_at" value={version} />
          <input type="hidden" name="page" value={page} />
          <input type="hidden" name="confirm_delete" value="yes" />
          {state.message && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
            >
              {state.message}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialogCancel asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                취소
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={pending}
              className="bg-red-600 hover:bg-red-700"
            >
              {pending ? "삭제 중…" : "삭제하기"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
