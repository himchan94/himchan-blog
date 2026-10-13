---
name: db-design
description: himchan-blog의 PostgreSQL + Prisma 스키마 설계, 인덱스, 마이그레이션, 쿼리 최적화 가이드. Prisma 모델·관계·인덱스를 추가하거나 바꿀 때, 마이그레이션을 만들 때, 느린 쿼리를 볼 때 사용한다.
---

# DB 설계

참고: [wshobson/agents database-design](https://github.com/MoizIbnYousaf/ai-agent-skills/blob/main/skills/database-design/SKILL.md) (MIT). 이 프로젝트 컨벤션에 맞게 옮겼다.

## 전제

- PostgreSQL + Prisma 7 ([ADR-0001](../../../docs/adr/0001-postgresql-prisma.md)). 스키마는 `prisma/schema.prisma` 한 파일, CLI 설정은 루트 `prisma.config.ts`.
- 클라이언트는 `src/generated/prisma`에 생성된다(gitignore). import는 `@/generated/prisma/client` — `@prisma/client`에서 직접 import하지 않는다.
- 연결은 `@prisma/adapter-pg`. 연결 객체는 `src/lib/db.ts`의 `prisma` 하나뿐이다 — 새 `PrismaClient`를 만들지 않는다.
- 스키마를 바꾸기 전에 기존 모델과 [ADR-0002](../../../docs/adr/0002-content-data-model.md)를 읽고 형태를 맞춘다.
- 도메인 불변식·함정은 `docs/domain/`, 버린 대안은 `docs/adr/`에 남긴다. 스키마 주석은 *왜*만 한 줄로.

## 모델 컨벤션

| 항목 | 규칙 |
|---|---|
| 모델명 | PascalCase 단수 (`Post`) |
| 테이블명 | `@@map` 없이 모델명 그대로 (기존 모델과 맞춘다) |
| 컬럼명 | camelCase 그대로 (`@map` 쓰지 않음) |
| PK | `id String @id @default(cuid())`. 자연키가 곧 식별자면 그 키를 PK로 (`Page.key`) |
| FK | `{참조모델명}Id` (`postId`) + `@relation(..., onDelete: ...)` 명시 |
| 타임스탬프 | `updatedAt @updatedAt`. 생성 시점이 의미 있는 모델은 `createdAt @default(now())` |
| 공개 여부 | 발행 대상은 `status Status @default(DRAFT)` + `publishedAt DateTime?` (ADR-0002) |

```prisma
model Comment {
  id        String   @id @default(cuid())
  body      String
  postId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId, createdAt(sort: Desc)])
}
```

## 설계 원칙

- 기본은 3NF. 별개의 생명주기를 가진 것은 별도 모델로 분리한다.
- 비정규화는 측정된 읽기 병목이 있을 때만 하고, 원본과 동기화하는 경로를 한 곳에 모은다.
- 1:1은 FK 쪽에 `@unique`. 1:N은 FK에 `@@index` — **Prisma는 FK 인덱스를 자동으로 만들지 않는다.**
- `onDelete`는 의도적으로 고른다: 소유 관계는 `Cascade`, 참조만 하는 관계는 `Restrict`/`SetNull`.
- 상태값은 Prisma `enum` 또는 CHECK 제약으로 좁힌다. 금액은 `Decimal`, 절대 `Float` 쓰지 않는다.
- 민감 값(토큰·비밀번호)은 해시로 저장한다.

## 공개 여부의 함정

- 공개 쿼리는 항상 `status: "PUBLISHED"` 조건을 붙인다. 빠뜨리면 초안이 노출된다. `findUnique`는 유니크 키 외 조건을 못 붙이므로 `findFirst`를 쓴다 (`getPostBySlug` 참고).
- `slug`는 공개 URL이다. 발행 뒤 바꾸면 외부 링크가 깨진다.

## 인덱스

- 실제 `where`/`orderBy` 패턴에서 출발한다. 추측으로 만들지 않는다.
- 복합 인덱스는 등치 컬럼 먼저, 범위·정렬 컬럼 나중: `@@index([status, publishedAt])`.
- 배열 컬럼(`categories`, `tech`)을 `has`/`hasSome`으로 거르는 쿼리가 느려지면 GIN 인덱스를 검토한다: `@@index([categories], type: Gin)`.
- 부분 인덱스는 `@@index([...], where: ...)`로 스키마에 선언한다. 스키마로 표현 못 하는 인덱스는 마이그레이션 SQL에 직접 쓰고 `docs/domain/`에 남긴다 — 스키마에 없는 인덱스는 다음 `migrate dev`가 DROP한다.

```sql
-- 사용되지 않는 인덱스
SELECT relname, indexrelname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan;
-- 인덱스가 부족한 테이블
SELECT relname, seq_scan, seq_tup_read, idx_scan FROM pg_stat_user_tables
WHERE seq_scan > idx_scan ORDER BY seq_tup_read DESC;
```

## 마이그레이션

- **생성까지만 한다. 실행은 사용자가 한다.**
  ```bash
  npx prisma migrate dev --create-only --name <snake_case_설명>
  ```
- DB 없이 만들 때는 스키마끼리 비교한다: `git show HEAD:prisma/schema.prisma > <임시파일>` 후 `npx prisma migrate diff --from-schema <임시파일> --to-schema prisma/schema.prisma --script`
- 생성된 `migration.sql`을 반드시 읽고 확인한다: 의도하지 않은 DROP, 기존 행이 있는 테이블에 기본값 없는 NOT NULL 추가, 컬럼 rename이 DROP+ADD로 나온 경우.
- 컬럼 rename은 생성된 SQL을 `ALTER TABLE ... RENAME COLUMN`으로 고친다 (데이터 유실 방지).
- 운영 데이터가 있는 테이블의 파괴적 변경은 단계를 나눈다:
  1. nullable 컬럼 추가 → 2. 코드가 양쪽에 쓰기 → 3. 백필 → 4. 새 컬럼에서 읽기 → 5. 옛 컬럼 제거
- 스키마를 바꾼 뒤 `npx prisma generate`로 클라이언트를 재생성한다.

## 쿼리

- 쿼리는 `src/lib/*.ts`에 모으고, DB 행은 그 파일 안에서 화면용 타입으로 바꿔 내보낸다 (`toPost` 참고). 컴포넌트에서 `prisma`를 직접 부르지 않는다.
- `select`로 필요한 컬럼만 가져온다 — 목록에는 `content`가 필요 없다. 루프 안에서 쿼리하지 않는다 (N+1).
- 큰 목록은 `skip` 오프셋 대신 커서 페이지네이션 (`cursor` + `take`, 정렬 키에 인덱스).
- 느린 쿼리는 추측하지 말고 `EXPLAIN (ANALYZE, BUFFERS)`로 확인한다: Seq Scan 여부, 예상/실제 행 수 차이.

## 체크리스트

- [ ] 모델·FK 명명 규칙을 지켰다
- [ ] 모든 FK에 인덱스 또는 `@unique`가 있다
- [ ] `onDelete`를 의도적으로 정했다
- [ ] 공개 쿼리에 `status: "PUBLISHED"` 조건이 있다
- [ ] `--create-only`로 만든 `migration.sql`을 읽고 검토했다
- [ ] Prisma로 표현 안 되는 제약·인덱스, 새 불변식을 `docs/domain/`에 남겼다
