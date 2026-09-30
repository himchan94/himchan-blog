import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { isMock, mockAbout } from "@/mocks";
import MDXContent from "@/components/mdx/MDXContent";
import ProfileImage from "@/components/ProfileImage";

export default async function About() {
  const about = isMock ? mockAbout() : await prisma.page.findUnique({ where: { key: "about" } });

  if (!about) {
    notFound();
  }

  return (
    <section className='tile'>
      <div className='mx-auto max-w-reading px-5'>
        <ProfileImage
          src='/images/me.png'
          alt='Profile Image'
          className='mb-8'
        />
        <MDXContent source={about.content} />
      </div>
    </section>
  );
}
