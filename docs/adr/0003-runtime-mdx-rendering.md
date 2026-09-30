# ADR-0003: 본문 MDX는 요청 시 next-mdx-remote로 컴파일하고, JSX 컴포넌트는 허용 목록으로만 쓴다

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: mdx

## Context

기존에는 `@next/mdx`가 빌드 타임에 `.mdx` 파일을 모듈로 컴파일했고, 본문이 `import`로 컴포넌트를 가져왔다
(`<TypingEffect/>`, `<TemperatureMonitor/>`). 본문이 DB 문자열이 되면서(ADR-0001) 빌드 타임 컴파일이 불가능해졌다.
관리자 외에는 본문을 쓰지 않지만, 문자열을 코드로 실행하는 경로이므로 실행 범위를 좁혀야 한다.

## Decision

`next-mdx-remote/rsc`의 `MDXRemote`로 서버 컴포넌트에서 요청 시 컴파일한다(`src/components/mdx/MDXContent.tsx`).
본문에서 쓸 수 있는 JSX 컴포넌트는 그 파일의 `allowedComponents`뿐이고(저장 시 `validate.ts`가 같은 목록으로 검사), 본문 안 `import`/`export`는 쓰지 않는다.
`blockJS` 기본값(`true`)을 유지해 `{표현식}`은 실행하지 않는다. 코드 하이라이트는 `rehype-highlight`를 유지한다.
`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`는 제거한다.

## Consequences

**좋아진 것**

- 재빌드 없이 본문을 바꿀 수 있다.
- frontmatter가 컬럼으로 빠져 h2로 렌더되던 문제를 숨기던 우회 코드가 사라졌다.

**감수한 것**

- 요청마다 MDX 컴파일 비용이 든다.
- 새 컴포넌트를 본문에서 쓰려면 코드에 등록하고 배포해야 한다.
- 본문에서 `{}` 표현식을 쓸 수 없다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| `@mdx-js/mdx`의 `evaluate` 직접 사용 | 같은 일을 더 많은 코드로 해야 하고 안전 기본값이 없다 |
| 순수 Markdown(react-markdown)으로 전환 | 기존 글의 JSX 컴포넌트를 쓸 수 없다 |
| 컴파일 결과를 DB에 캐시 | 글 수와 트래픽이 작아 필요 없다 |
