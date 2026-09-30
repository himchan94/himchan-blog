"use client";

import { useActionState } from "react";
import type { Post } from "@/generated/prisma/client";
import { ContentFields, Field, FormFooter, inputClass } from "../ui";
import { deletePost, savePost } from "./actions";

export default function PostForm({ post }: { post?: Post }) {
  const [state, action] = useActionState(savePost.bind(null, post?.id ?? null), {});

  return (
    <form action={action} className='space-y-4'>
      <ContentFields item={post} values={state.values}>
        <Field label='카테고리 (쉼표로 구분)'>
          <input name='categories' defaultValue={state.values?.categories ?? post?.categories.join(", ")} className={inputClass} />
        </Field>
      </ContentFields>
      <FormFooter error={state.error} deleteAction={post && deletePost.bind(null, post.id)} />
    </form>
  );
}
