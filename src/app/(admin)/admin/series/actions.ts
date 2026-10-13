"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { isMock, mockAdmin } from "@/mocks";
import { Prisma } from "@/generated/prisma/client";
import { field, formError, type FormState } from "../_lib/form";

export async function saveSeries(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const data = { title: field(formData, "title"), description: field(formData, "description") };
  if (!data.title) return formError("제목을 입력하세요.", formData);

  if (isMock) {
    const error = mockAdmin.saveSeries(id, data);
    if (error) return formError(error, formData);
    revalidatePath("/", "layout");
    return { message: "저장했습니다." };
  }

  try {
    if (id) await prisma.series.update({ where: { id }, data });
    else await prisma.series.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return formError("같은 제목의 시리즈가 있습니다.", formData);
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return { message: "저장했습니다." };
}

// 글이 연결된 시리즈는 FK(Restrict)가 삭제를 막는다. 폼은 글이 없을 때만 삭제 버튼을 보인다.
export async function deleteSeries(id: string) {
  await requireAdmin();
  if (isMock) mockAdmin.deleteSeries(id);
  else await prisma.series.deleteMany({ where: { id } });
  revalidatePath("/", "layout");
}
