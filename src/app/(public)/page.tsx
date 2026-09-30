import PostList from "@/components/PostList";
import ProjectList from "@/components/ProjectList";
import { GITHUB_URL } from "@/consts";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts(5);
  const projects = await getAllProjects(3);

  return (
    <>
      <section className='tile text-center'>
        <div className='mx-auto max-w-text px-5'>
          <h1 className='font-display text-display-md font-semibold sm:text-hero'>
            DEVHIMCHAN
          </h1>
          <p className='mt-4 text-tagline text-ink-80 sm:text-lead'>
            만들고, 배우고, 기록합니다. 풀스택 개발자 김힘찬의 블로그.
          </p>
          <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <a
              href={GITHUB_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='btn-primary'>
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                <path
                  fillRule='evenodd'
                  d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                  clipRule='evenodd'
                />
              </svg>
              GitHub 방문하기
            </a>
            <Link href='/about' className='btn-secondary'>
              WHO AM I ?
            </Link>
          </div>
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section className='tile-parchment'>
        <div className='mx-auto max-w-grid px-5'>
          <div className='mb-10 flex items-center justify-between'>
            <h2 className='font-display text-lead font-semibold sm:text-display-md'>
              프로젝트
            </h2>
            <Link href='/projects' className='group text-link inline-flex items-center'>
              모든 프로젝트 보기
              <svg
                className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </Link>
          </div>

          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <p className='py-16 text-center text-ink-48'>
              아직 작성된 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className='tile'>
        <div className='mx-auto max-w-text px-5'>
          <div className='mb-10 flex items-center justify-between'>
            <h2 className='font-display text-lead font-semibold sm:text-display-md'>
              최신 포스트
            </h2>
            {posts.length === 5 && (
              <Link href='/blog' className='group text-link inline-flex items-center'>
                모든 포스트 보기
                <svg
                  className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </Link>
            )}
          </div>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className='py-16 text-center text-ink-48'>
              아직 작성된 포스트가 없습니다.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
