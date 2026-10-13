"use client";

import { useFormStatus } from "react-dom";
import type { Status } from "@/generated/prisma/client";
import MarkdownField from "./MarkdownField";

export const inputClass =
  "input";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='block space-y-1'>
      <span className='text-caption font-semibold text-ink-80'>{label}</span>
      {children}
    </label>
  );
}

type ContentItem = {
  slug: string;
  title: string;
  description: string;
  content: string;
  status: Status;
  publishedAt: Date | null;
};

// Post·Project 공통 입력. 공개된 항목의 slug는 외부 링크라 잠근다.
export function ContentFields({
  item,
  values,
  children,
}: {
  item?: ContentItem;
  values?: Record<string, string>;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field label='제목'>
          <input name='title' defaultValue={values?.title ?? item?.title} required className={inputClass} />
        </Field>
        <Field label='slug (URL)'>
          <input
            name='slug'
            defaultValue={values?.slug ?? item?.slug}
            readOnly={item?.status === "PUBLISHED"}
            required
            className={`${inputClass} read-only:opacity-60`}
          />
        </Field>
      </div>
      <Field label='설명'>
        <input name='description' defaultValue={values?.description ?? item?.description} className={inputClass} />
      </Field>
      {children}
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field label='상태'>
          <select name='status' defaultValue={values?.status ?? item?.status ?? "DRAFT"} className={inputClass}>
            <option value='DRAFT'>임시저장</option>
            <option value='PUBLISHED'>공개</option>
          </select>
        </Field>
        <Field label='발행일 (비우면 공개 시점)'>
          <input
            type='date'
            name='publishedAt'
            defaultValue={values?.publishedAt ?? item?.publishedAt?.toISOString().slice(0, 10)}
            className={inputClass}
          />
        </Field>
      </div>
      <MarkdownField name='content' defaultValue={item?.content} />
    </>
  );
}

export function FormFooter({
  error,
  message,
  deleteAction,
}: {
  error?: string;
  message?: string;
  deleteAction?: () => Promise<void>;
}) {
  const { pending } = useFormStatus();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <button
        type='submit'
        disabled={pending}
        className='btn-primary'>
        {pending ? "저장 중…" : "저장"}
      </button>
      {deleteAction && (
        <button
          formAction={deleteAction}
          formNoValidate
          disabled={pending}
          onClick={(event) => {
            if (!confirm("삭제할까요? 되돌릴 수 없습니다.")) event.preventDefault();
          }}
          className='btn-pearl !text-danger'>
          삭제
        </button>
      )}
      {message && <p className='text-caption text-ink-80'>{message}</p>}
      {error && <p className='w-full whitespace-pre-wrap text-caption text-danger'>{error}</p>}
    </div>
  );
}
