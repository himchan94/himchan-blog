import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { isMock, mockAbout } from "@/mocks";
import AboutForm from "./AboutForm";

export default async function AdminAbout() {
  await requireAdmin();
  const about = isMock ? mockAbout() : await prisma.page.findUnique({ where: { key: "about" } });

  return (
    <div className='space-y-4'>
      <h1 className='text-tagline font-semibold'>About</h1>
      <AboutForm content={about?.content ?? ""} />
    </div>
  );
}
