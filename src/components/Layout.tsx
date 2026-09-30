"use client";

import { EMAIL, GITHUB_URL } from "@/consts";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메뉴가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className='min-h-screen bg-canvas text-ink'>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      <header className='sticky top-0 z-10 bg-tile text-on-dark'>
        <nav className='mx-auto max-w-grid px-5'>
          <div className='flex h-11 items-center justify-between'>
            <Link
              href='/'
              className='font-display text-tagline font-semibold tracking-tight text-on-dark'>
              DEVHIMCHAN
            </Link>

            <div className='flex items-center gap-6'>
              <div className='flex md:order-last'>
                <ThemeToggle />
              </div>

              {/* 햄버거 메뉴 버튼 (모바일) */}
              <button
                onClick={toggleMenu}
                className='md:hidden -m-2 p-2 text-on-dark z-30 relative'
                aria-label='메뉴 열기'>
                {isMenuOpen ? (
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>

              {/* 데스크탑 메뉴 */}
              <ul className='hidden md:flex items-center gap-8 text-caption'>
                <li>
                  <Link
                    href='/'
                    className='text-on-dark hover:text-primary-on-dark transition-colors'>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href='/about'
                    className='text-on-dark hover:text-primary-on-dark transition-colors'>
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    className='text-on-dark hover:text-primary-on-dark transition-colors'>
                    BLOG
                  </Link>
                </li>
                <li>
                  <Link
                    href='/projects'
                    className='text-on-dark hover:text-primary-on-dark transition-colors'>
                    PROJECTS
                  </Link>
                </li>
                <li>
                  <a
                    href={GITHUB_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-on-dark hover:text-primary-on-dark transition-colors'>
                    <svg
                      className='w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'>
                      <path
                        fillRule='evenodd'
                        d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* 모바일 사이드 네비게이션 */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-tile text-on-dark z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className='p-6 h-full flex flex-col'>
          <div className='flex justify-end mb-8'>
            <button
              onClick={toggleMenu}
              className='text-on-dark hover:text-primary-on-dark transition-colors'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='border-b border-white/15 pb-4 mb-4'>
            <span className='text-tagline font-semibold text-on-dark'>
              메뉴
            </span>
          </div>

          <ul className='flex flex-col space-y-4 text-body'>
            <li>
              <Link
                href='/'
                className='flex items-center text-on-dark hover:text-primary-on-dark transition-colors py-2'
                onClick={toggleMenu}>
                <svg
                  className='w-5 h-5 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                HOME
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='flex items-center text-on-dark hover:text-primary-on-dark transition-colors py-2'
                onClick={toggleMenu}>
                <svg
                  className='w-5 h-5 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href='/blog'
                className='flex items-center text-on-dark hover:text-primary-on-dark transition-colors py-2'
                onClick={toggleMenu}>
                <svg
                  className='w-5 h-5 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14z'
                  />
                </svg>
                BLOG
              </Link>
            </li>
            <li>
              <Link
                href='/projects'
                className='flex items-center text-on-dark hover:text-primary-on-dark transition-colors py-2'
                onClick={toggleMenu}>
                <svg
                  className='w-5 h-5 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                PROJECTS
              </Link>
            </li>
          </ul>

          <div className='mt-auto pt-6 border-t border-white/15'>
            <div className='flex space-x-4'>
              <a
                href={GITHUB_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='text-on-dark hover:text-primary-on-dark transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className='text-on-dark hover:text-primary-on-dark transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <main>{children}</main>
      <footer className='bg-parchment text-ink-80'>
        <div className='mx-auto max-w-text px-5 py-10'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <span className='text-fine text-ink-48'>
              © {2025} devhimchan. All Rights Reserved.
            </span>
            {/* 소셜 링크 */}
            <div className='flex justify-center gap-6'>
              <a
                href={GITHUB_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-2 text-caption text-ink-80 hover:text-primary transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className='group flex items-center gap-2 text-caption text-ink-80 hover:text-primary transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <span>EMAIL</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
