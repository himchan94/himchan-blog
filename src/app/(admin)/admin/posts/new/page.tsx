import PostForm from "../PostForm";

export default function NewPost() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>새 글</h1>
      <PostForm />
    </div>
  );
}
