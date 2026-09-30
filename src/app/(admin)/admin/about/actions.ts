"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { validateMdx } from "@/components/mdx/validate";
import { field, formError, type FormState } from "../form";

export async function saveAbout(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const content = field(formData, "content");
  const mdxError = await validateMdx(content);
  if (mdxError) return formError(mdxError, formData);

  await prisma.page.upsert({
    where: { key: "about" },
    create: { key: "about", content },
    update: { content },
  });

  revalidatePath("/about");
  return { message: "저장했습니다." };
}
