"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import {
  field,
  formError,
  readContentFields,
  splitList,
  toSaveError,
  type FormState,
} from "../form";

export async function savePost(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const fields = await readContentFields(formData);
  if (typeof fields === "string") return formError(fields, formData);
  const data = { ...fields, categories: splitList(field(formData, "categories")) };

  try {
    if (id) {
      const existing = await prisma.post.findUniqueOrThrow({ where: { id } });
      if (existing.status === "PUBLISHED") data.slug = existing.slug;
      await prisma.post.update({ where: { id }, data });
    } else {
      await prisma.post.create({ data });
    }
  } catch (error) {
    return toSaveError(error, formData);
  }

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.deleteMany({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/posts");
}
