import Link from "next/link";
import Image from "next/image";
import { ProjectSummary } from "@/lib/projects";

interface ProjectCardProps {
  project: ProjectSummary;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'>
      <Link href={`/projects/${project.slug}`} className='block'>
        <div className='relative h-48 w-full'>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className='object-cover'
          />
        </div>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white'>
            {project.title}
          </h3>
          <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
            {project.description}
          </p>
          <div className='flex flex-wrap gap-2 mb-4'>
            {project.tech.map((tech) => (
              <span
                key={tech}
                className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                {tech}
              </span>
            ))}
          </div>
          <div className='flex justify-between items-center'>
            <time className='text-sm text-gray-500 dark:text-gray-400'>
              {new Date(project.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
}
