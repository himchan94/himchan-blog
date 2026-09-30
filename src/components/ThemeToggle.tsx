"use client";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const isDark =
      root.getAttribute("data-color-mode") === "dark" ||
      (!root.hasAttribute("data-color-mode") &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-color-mode", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // 아이콘은 CSS(dark 변형)로 바꿔 서버 렌더링과 어긋나지 않게 한다.
  return (
    <button
      type='button'
      onClick={toggle}
      aria-label='다크 모드 전환'
      className='-m-2 p-2 text-on-dark hover:text-primary-on-dark transition-colors'>
      <svg
        className='h-5 w-5 dark:hidden'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        aria-hidden='true'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
        />
      </svg>
      <svg
        className='hidden h-5 w-5 dark:block'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        aria-hidden='true'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        />
      </svg>
    </button>
  );
}
