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
docker compose --profile dev up -d   # PostgreSQL만 뜬다
npx prisma migrate deploy
npm run dev
```

- 이미지 업로드는 S3 호환 저장소가 필요하다. 로컬에 띄운 저장소(Garage·MinIO 등)의 버킷·키를 `S3_*`에 넣는다.
- 공개 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin
  - GitHub OAuth App의 callback URL은 `http://localhost:3000/api/auth/callback/github`로 등록한다.
  - `ADMIN_GITHUB_ID`에는 `https://api.github.com/users/<login>`에서 확인한 숫자 `id`를 넣는다.

## 프로젝트 구조

```
src/
├── app/
│   ├── (public)/        # 공개 페이지 (요청 시 렌더링)
│   ├── (admin)/admin/   # 관리자 CRUD (_components·_lib: 라우트가 아닌 공용 모듈)
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

서버 디렉토리는 공용 인프라 `/srv/infra/*`, 앱 `/srv/apps/*`로 나눈다. 이 repo는 `/srv/apps/himchan-blog`에 clone한다.

- 공용 Postgres(`/srv/infra/postgres`)가 외부 network `postgres`에 떠 있어야 한다 ([ADR-0008](docs/adr/0008-shared-postgres-host-nginx.md)).
  블로그 전용 계정과 DB를 만들고 `.env`의 `POSTGRES_USER`·`POSTGRES_PASSWORD`·`POSTGRES_DB`에 넣는다.
- 공용 Garage(`/srv/infra/garage`)가 외부 network `garage`에 떠 있어야 한다 ([ADR-0009](docs/adr/0009-garage-instead-of-minio.md)).
  블로그용 버킷과 그 버킷만 허용한 키를 만들어 `.env`의 `S3_*`에 넣는다.

```sql
CREATE ROLE blog LOGIN PASSWORD '<secret>';
CREATE DATABASE blog OWNER blog;
REVOKE ALL ON DATABASE blog FROM PUBLIC;
```

```bash
# /srv/infra/garage에서
docker compose exec garage /garage bucket create blog
docker compose exec garage /garage key create blog-app       # 출력된 Key ID·Secret을 S3_ACCESS_KEY·S3_SECRET_KEY에
docker compose exec garage /garage bucket allow --read --write blog --key blog-app
```

```bash
cp .env.example .env        # 운영 값으로 채운다
docker compose --profile app up -d --build
```

`migrate` 서비스가 `prisma migrate deploy`를 실행한 뒤 `app`이 `127.0.0.1:3000`에 뜬다.
호스트 nginx가 이 포트로 프록시한다(`client_max_body_size`는 이미지 업로드 한도에 맞춰 11m 이상). 운영 GitHub OAuth App의 callback URL은 운영 도메인으로 등록한다.

## 라이선스

MIT License
