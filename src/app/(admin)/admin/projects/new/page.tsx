import ProjectForm from "../ProjectForm";

export default function NewProject() {
  return (
    <div className='space-y-4'>
      <h1 className='text-tagline font-semibold'>새 프로젝트</h1>
      <ProjectForm />
    </div>
  );
}
