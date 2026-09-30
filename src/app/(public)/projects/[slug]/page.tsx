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
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <div className='relative aspect-video w-full mb-6'>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>

        <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
          {project.title}
        </h1>

        <div className='mb-4'>
          <time className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
            {new Date(project.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className='flex flex-wrap gap-2 mb-6'>
          {project.tech.map((tech) => (
            <span
              key={tech}
              className='px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
              {tech}
            </span>
          ))}
        </div>

        <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
          {project.description}
        </p>

        <div className='flex flex-wrap gap-4 mb-8'>
          {project.github && (
            <a
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors'>
              <svg
                className='w-5 h-5 mr-2'
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
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
              <svg
                className='w-5 h-5 mr-2'
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

      <div className='prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800'>
        <MDXContent source={project.content} />
      </div>

      <footer className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
          <Link
            href='/projects'
            className='group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'>
            <svg
              className='w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform'
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
        </div>
      </footer>
    </div>
  );
}
