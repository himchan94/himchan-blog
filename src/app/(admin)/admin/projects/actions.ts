"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { isMock, mockAdmin } from "@/mocks";
import {
  field,
  formError,
  readContentFields,
  splitList,
  toSaveError,
  type FormState,
} from "../form";

export async function saveProject(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const fields = await readContentFields(formData);
  if (typeof fields === "string") return formError(fields, formData);
  const data = {
    ...fields,
    thumbnail: field(formData, "thumbnail") || null,
    github: field(formData, "github") || null,
    demo: field(formData, "demo") || null,
    tech: splitList(field(formData, "tech")),
  };

  if (isMock) {
    const error = mockAdmin.saveProject(id, data);
    if (error) return formError(error, formData);
    revalidatePath("/", "layout");
    redirect("/admin/projects");
  }

  try {
    if (id) {
      const existing = await prisma.project.findUniqueOrThrow({ where: { id } });
      if (existing.status === "PUBLISHED") data.slug = existing.slug;
      await prisma.project.update({ where: { id }, data });
    } else {
      await prisma.project.create({ data });
    }
  } catch (error) {
    return toSaveError(error, formData);
  }

  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  if (isMock) mockAdmin.deleteProject(id);
  else await prisma.project.deleteMany({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}
