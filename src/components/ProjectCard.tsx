import Link from "next/link";
import Image from "next/image";
import { ProjectSummary } from "@/lib/projects";

interface ProjectCardProps {
  project: ProjectSummary;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className='card block overflow-hidden p-0'>
      <div className='relative h-48 w-full'>
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className='object-cover'
        />
      </div>
      <div className='p-6'>
        <h3 className='font-display text-tagline font-semibold text-ink mb-2'>
          {project.title}
        </h3>
        <p className='text-body text-ink-80 mb-4 line-clamp-2'>
          {project.description}
        </p>
        <div className='flex flex-wrap gap-2 mb-4'>
          {project.tech.map((tech) => (
            <span key={tech} className='chip'>
              {tech}
            </span>
          ))}
        </div>
        <time className='text-caption text-ink-48'>
          {new Date(project.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}
