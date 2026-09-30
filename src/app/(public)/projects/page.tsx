import ProjectList from "@/components/ProjectList";
import { getAllProjects } from "@/lib/projects";

export default async function Projects() {
  const projects = await getAllProjects();

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        프로젝트
      </h1>

      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className='text-gray-600 dark:text-gray-400 text-center py-12'>
          아직 등록된 프로젝트가 없습니다.
        </p>
      )}
    </div>
  );
}
