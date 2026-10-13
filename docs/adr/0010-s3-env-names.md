# ADR-0010: 저장소 env 이름은 제품명 대신 `S3_*`를 쓴다

- **Status**: Accepted
- **Date**: 2026-10-14
- **Domain**: admin

## Context

ADR-0009는 저장소 서버를 Garage로 바꾸면서 env 이름 `MINIO_*`를 그대로 두기로 했다.
운영에 배포하기 전이라 이름을 바꿔도 옮길 운영 값이 없다. 앱은 S3 API만 쓰고, 로컬에서는 다른 S3 호환 저장소를 쓸 수 있다.

## Decision

저장소 env는 `S3_URL`·`S3_BUCKET`·`S3_ACCESS_KEY`·`S3_SECRET_KEY`·`S3_NETWORK`다. ADR-0009의 env 이름 부분을 대체한다.
클라이언트 라이브러리는 `minio` 패키지 그대로다.

## Consequences

**좋아진 것**

- 저장소 제품이 바뀌어도 env 이름이 틀려지지 않는다.

**감수한 것**

- 기존 로컬 `.env`의 `MINIO_*`를 직접 바꿔야 한다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| `MINIO_*` 유지 (ADR-0009) | 서버가 MinIO가 아니어서 이름이 오해를 부른다 |
| `GARAGE_*` | 로컬이나 다음 저장소가 Garage가 아니면 같은 불일치가 다시 생긴다 |
