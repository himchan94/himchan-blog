import { notFound } from "next/navigation";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import ProjectForm from "../ProjectForm";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>프로젝트 수정</h1>
      <ProjectForm project={project} />
    </div>
  );
}
