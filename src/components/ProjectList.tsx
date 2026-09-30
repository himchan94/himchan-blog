import { ProjectSummary } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: ProjectSummary[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
