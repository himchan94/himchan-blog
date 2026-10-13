"use client";

import { useActionState } from "react";
import { Field, FormFooter, inputClass } from "../_components/ui";
import { deleteSeries, saveSeries } from "./actions";

type Series = { id: string; title: string; description: string; postCount: number };

export default function SeriesForm({ series }: { series?: Series }) {
  const [state, action] = useActionState(saveSeries.bind(null, series?.id ?? null), {});

  return (
    <form action={action} className='space-y-4 card'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field label='제목'>
          <input name='title' defaultValue={state.values?.title ?? series?.title} required className={inputClass} />
        </Field>
        <Field label='설명'>
          <input name='description' defaultValue={state.values?.description ?? series?.description} className={inputClass} />
        </Field>
      </div>
      {series && <p className='text-caption text-ink-48'>연결된 글 {series.postCount}개</p>}
      <FormFooter
        error={state.error}
        message={state.message}
        deleteAction={series && series.postCount === 0 ? deleteSeries.bind(null, series.id) : undefined}
      />
    </form>
  );
}
