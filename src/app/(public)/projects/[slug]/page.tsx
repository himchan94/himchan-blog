import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import MDXContent from "@/components/mdx/MDXContent";
import Image from "next/image";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className='tile-parchment'>
        <div className='mx-auto max-w-text px-5'>
          <div className='relative aspect-video w-full mb-10'>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className='object-cover rounded-lg shadow-product'
              priority
            />
          </div>

          <h1 className='font-display text-display-lg font-semibold text-ink mb-4'>
            {project.title}
          </h1>

          <div className='mb-4'>
            <time className='text-caption text-ink-48'>
              {new Date(project.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <div className='flex flex-wrap gap-2 mb-6'>
            {project.tech.map((tech) => (
              <span key={tech} className='chip'>
                {tech}
              </span>
            ))}
          </div>

          <p className='text-tagline text-ink-80 mb-8'>{project.description}</p>

          <div className='flex flex-wrap gap-4'>
            {project.github && (
              <a
                href={project.github}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-secondary'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-primary'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
                라이브 데모
              </a>
            )}
          </div>
        </div>
      </section>

      <section className='tile'>
        <div className='mx-auto max-w-reading px-5'>
          <MDXContent source={project.content} />

          <footer className='mt-16 pt-8 border-t border-hairline'>
            <Link
              href='/projects'
              className='group text-link inline-flex items-center gap-2'>
              <svg
                className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              목록으로 돌아가기
            </Link>
          </footer>
        </div>
      </section>
    </>
  );
}
