# 결정 기록 (ADR)

> **이 디렉토리는 append-only다.** 기존 ADR의 내용은 고치지 않는다.
> 결정이 바뀌면 **새 ADR을 쓰고**, 옛 ADR의 Status를 `Superseded by ADR-NNNN`으로만 바꾼다.

## 왜 있는가

일반 문서는 *현재 상태*를 담기 때문에 결정이 바뀌면 덮어쓰게 되고, **왜 바꿨는지가 사라진다.**
ADR은 그 소실을 막는 자리다 — 다른 문서가 "지금 무엇인가"를, ADR이 "어떻게 여기까지 왔는가"를 담당한다.

## 언제 쓰는가

기준은 **"되돌리는 비용"** 하나다.

**✅ ADR 대상 — 비싸게 되돌리는 것**

- 콘텐츠 포맷 · 핵심 데이터 모델 (글 frontmatter 등)
- 공개 URL 구조 (바뀌면 외부 링크가 깨진다)
- 의존성 채택 / 거부 (라이브러리, 인프라)
- 빌드 · 배포 방식
- 디렉토리 경계
- 문서 · 협업 체계

**❌ ADR 아님 — 싸게 되돌리는 것**

- 함수 시그니처, 내부 리팩터링
- 버그 수정, 성능 튜닝
- 개별 기능 추가 (그 기능이 새 경계를 만들지 않는 한)

> 애매하면 묻는다: **"6개월 뒤에 누가 '왜 이렇게 했지?'라고 물을 만한가?"**
> 아니면 커밋 메시지로 충분하다.

## 규칙

- 파일명: `NNNN-kebab-case-title.md` — 4자리 zero-pad, 날짜 프리픽스 없음
- **번호가 안정적 참조자다.** 코드 주석에서 `// ADR-0007` 로 인용한다
- 번호는 재사용하지 않는다. 폐기된 결정도 `Superseded`로 남긴다
- 한 ADR = 한 결정. 여러 결정이 얽히면 파일을 나누고 서로 링크한다
- 새 ADR을 추가하면 아래 인덱스에 한 줄 더한다
- 템플릿: [`0000-template.md`](0000-template.md)

## Status

| Status | 의미 |
|---|---|
| `Proposed` | 논의 중. 아직 코드에 반영되지 않음 |
| `Accepted` | 확정. 현재 코드가 이 결정을 따름 |
| `Superseded by ADR-NNNN` | 다른 결정으로 대체됨. 내용은 히스토리로 보존 |
| `Deprecated` | 더 이상 유효하지 않으나 대체 결정도 없음 (해당 영역 자체가 사라짐) |

---

## 인덱스

| # | 결정 | Status | 도메인 |
|---|------|--------|--------|
| [0001](0001-postgresql-prisma.md) | 콘텐츠 저장소를 PostgreSQL + Prisma 7로 옮긴다 | Accepted | platform |
| [0002](0002-content-data-model.md) | 콘텐츠 데이터 모델 — Post/Project/Page, 카테고리는 배열, 인증 테이블 없음 | Accepted | platform |
| [0003](0003-runtime-mdx-rendering.md) | 본문 MDX는 요청 시 컴파일, JSX 컴포넌트는 허용 목록 | Accepted | mdx |
| [0004](0004-dynamic-public-rendering.md) | 공개 페이지는 요청 시 렌더링, 빌드는 DB 비의존 | Accepted | platform |
| [0005](0005-authjs-github-allowlist.md) | 관리자 인증은 Auth.js v5 + GitHub id allowlist + JWT | Accepted | admin |
| [0006](0006-vps-docker-deploy.md) | GitHub Pages 대신 VPS에서 Docker Compose로 배포 | Accepted | platform |
| [0007](0007-minio-image-upload.md) | 관리자 업로드 이미지는 공용 MinIO + 앱의 /media/* 프록시 | Accepted | admin |
| [0008](0008-shared-postgres-host-nginx.md) | 운영 DB는 공용 Postgres, 앞단은 호스트 nginx | Accepted | platform |
| [0009](0009-garage-instead-of-minio.md) | 공용 S3 저장소 서버를 MinIO 대신 Garage로 | Accepted | admin |
| [0010](0010-s3-env-names.md) | 저장소 env 이름은 `S3_*` | Accepted | admin |
| [0011](0011-ghcr-actions-deploy.md) | main push → Actions가 GHCR에 이미지, SSH forced command로 배포 | Accepted | platform |
