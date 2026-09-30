"use client";

import { useActionState } from "react";
import MarkdownField from "../MarkdownField";
import { FormFooter } from "../ui";
import { saveAbout } from "./actions";

export default function AboutForm({ content }: { content: string }) {
  const [state, action] = useActionState(saveAbout, {});

  return (
    <form action={action} className='space-y-4'>
      <MarkdownField name='content' defaultValue={content} />
      <FormFooter error={state.error} message={state.message} />
    </form>
  );
}
