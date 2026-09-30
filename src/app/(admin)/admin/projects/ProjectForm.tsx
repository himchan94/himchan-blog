"use client";

import { useActionState } from "react";
import type { Project } from "@/generated/prisma/client";
import { ContentFields, Field, FormFooter, inputClass } from "../ui";
import { deleteProject, saveProject } from "./actions";

export default function ProjectForm({ project }: { project?: Project }) {
  const [state, action] = useActionState(saveProject.bind(null, project?.id ?? null), {});

  return (
    <form action={action} className='space-y-4'>
      <ContentFields item={project} values={state.values}>
        <Field label='썸네일 URL (비우면 기본 이미지)'>
          <input name='thumbnail' defaultValue={state.values?.thumbnail ?? project?.thumbnail ?? ""} className={inputClass} />
        </Field>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='GitHub URL'>
            <input name='github' type='url' defaultValue={state.values?.github ?? project?.github ?? ""} className={inputClass} />
          </Field>
          <Field label='데모 URL'>
            <input name='demo' type='url' defaultValue={state.values?.demo ?? project?.demo ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label='기술 스택 (쉼표로 구분)'>
          <input name='tech' defaultValue={state.values?.tech ?? project?.tech.join(", ")} className={inputClass} />
        </Field>
      </ContentFields>
      <FormFooter error={state.error} deleteAction={project && deleteProject.bind(null, project.id)} />
    </form>
  );
}
