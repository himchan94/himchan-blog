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

export async function savePost(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const fields = await readContentFields(formData);
  if (typeof fields === "string") return formError(fields, formData);
  const seriesId = field(formData, "seriesId") || null;
  const seriesOrder = seriesId ? Number(field(formData, "seriesOrder")) : null;
  if (seriesId && !(Number.isInteger(seriesOrder) && seriesOrder! > 0)) {
    return formError("시리즈 내 순서를 1 이상의 정수로 입력하세요.", formData);
  }
  const data = { ...fields, categories: splitList(field(formData, "categories")), seriesId, seriesOrder };

  if (isMock) {
    const error = mockAdmin.savePost(id, data);
    if (error) return formError(error, formData);
    revalidatePath("/", "layout");
    redirect("/admin/posts");
  }

  // (seriesId, seriesOrder) 유니크 위반은 P2002라 slug 중복과 구분되지 않아 미리 확인한다.
  if (seriesId) {
    const taken = await prisma.post.findFirst({
      where: { seriesId, seriesOrder, NOT: id ? { id } : undefined },
      select: { title: true },
    });
    if (taken) return formError(`이 시리즈의 ${seriesOrder}번은 "${taken.title}"가 쓰고 있습니다.`, formData);
  }

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
  if (isMock) mockAdmin.deletePost(id);
  else await prisma.post.deleteMany({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/posts");
}
