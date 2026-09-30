import ProjectList from "@/components/ProjectList";
import { getAllProjects } from "@/lib/projects";

export default async function Projects() {
  const projects = await getAllProjects();

  return (
    <>
      <section className='tile-parchment'>
        <div className='mx-auto max-w-grid px-5 text-center'>
          <h1 className='font-display text-display-lg font-semibold text-ink'>
            프로젝트
          </h1>
        </div>
      </section>

      <section className='tile'>
        <div className='mx-auto max-w-grid px-5'>
          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <p className='text-body text-ink-48 text-center'>
              아직 등록된 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
