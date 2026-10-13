"use client";

import { useActionState } from "react";
import type { Post } from "@/generated/prisma/client";
import { ContentFields, Field, FormFooter, inputClass } from "../_components/ui";
import { deletePost, savePost } from "./actions";

export default function PostForm({
  post,
  seriesOptions,
}: {
  post?: Post;
  seriesOptions: { id: string; title: string }[];
}) {
  const [state, action] = useActionState(savePost.bind(null, post?.id ?? null), {});

  return (
    <form action={action} className='space-y-4'>
      <ContentFields item={post} values={state.values}>
        <Field label='카테고리 (쉼표로 구분)'>
          <input name='categories' defaultValue={state.values?.categories ?? post?.categories.join(", ")} className={inputClass} />
        </Field>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='시리즈'>
            <select name='seriesId' defaultValue={state.values?.seriesId ?? post?.seriesId ?? ""} className={inputClass}>
              <option value=''>없음</option>
              {seriesOptions.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label='시리즈 내 순서'>
            <input
              type='number'
              name='seriesOrder'
              min={1}
              defaultValue={state.values?.seriesOrder ?? post?.seriesOrder ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </ContentFields>
      <FormFooter error={state.error} deleteAction={post && deletePost.bind(null, post.id)} />
    </form>
  );
}
