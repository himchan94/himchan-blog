# DEVHIMCHAN 블로그

Next.js 기반 개인 블로그입니다. 글·프로젝트·About은 PostgreSQL에 저장하고, `/admin`에서 작성합니다.

## 기술 스택

- [Next.js 16](https://nextjs.org) (App Router, standalone 출력), React 19, TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- PostgreSQL 17 + [Prisma 7](https://www.prisma.io)
- 본문: MDX 문자열을 요청 시 [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)로 렌더링
- 관리자 인증: [Auth.js](https://authjs.dev) (GitHub OAuth, 계정 1개 허용)

## 로컬 개발

```bash
cp .env.example .env        # AUTH_* 값은 GitHub OAuth App을 만들어 채운다
npm install                 # postinstall에서 prisma generate
docker compose up -d        # PostgreSQL만 뜬다
npx prisma migrate deploy
npm run dev
```

- 공개 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin
  - GitHub OAuth App의 callback URL은 `http://localhost:3000/api/auth/callback/github`로 등록한다.
  - `ADMIN_GITHUB_ID`에는 `https://api.github.com/users/<login>`에서 확인한 숫자 `id`를 넣는다.

기존 MDX 파일(`src/content/`)을 DB로 옮길 때는 한 번만 실행한다(다시 실행해도 slug 기준으로 덮어쓴다).

```bash
npx tsx scripts/import-mdx.ts
```

## 프로젝트 구조

```
src/
├── app/
│   ├── (public)/        # 공개 페이지 (요청 시 렌더링)
│   ├── (admin)/admin/   # 관리자 CRUD
│   └── api/auth/        # Auth.js 라우트
├── auth.ts              # 인증 설정, requireAdmin()
├── components/mdx/      # MDX 렌더러, 허용 컴포넌트, 저장 전 검증
├── features/            # 본문에서 쓰는 컴포넌트
└── lib/                 # DB 클라이언트, 조회 함수
prisma/                  # 스키마와 마이그레이션
docs/adr/                # 설계 결정 기록
docs/domain/             # 도메인별 불변식과 함정
```

## 배포 (VPS)

```bash
cp .env.example .env        # 운영 값으로 채운다. POSTGRES_PASSWORD는 반드시 바꾼다
docker compose --profile app up -d --build
```

`migrate` 서비스가 `prisma migrate deploy`를 실행한 뒤 `app`(포트 3000)이 뜬다.
PostgreSQL 포트는 `127.0.0.1`에만 열린다. 앞단에 리버스 프록시(HTTPS)를 두고, 운영 GitHub OAuth App의 callback URL을 운영 도메인으로 등록한다.

## 라이선스

MIT License
