# ADR-0009: 공용 S3 저장소 서버는 MinIO 대신 Garage를 쓴다

- **Status**: Accepted
- **Date**: 2026-10-14
- **Domain**: admin

## Context

ADR-0007은 서버에 공용 MinIO를 두기로 했다. 배포 시점에 `minio/minio`(Docker Hub)와 `quay.io/minio/minio` 모두 pull이 거부됐다.
MinIO가 커뮤니티 이미지 배포를 중단했기 때문이다. 앱은 S3 API만 쓰고(`putObject`·`getObject`), 클라이언트는 `minio` 패키지다.

## Decision

공용 저장소 서버는 `/srv/infra/garage`의 Garage(`dxflrs/garage`, 태그 고정, 단일 노드 `replication_factor = 1`)다.
외부 network `garage`에 붙고, S3 API(3900)는 루프백에만 연다. `s3_region`은 `us-east-1`로 둔다.
ADR-0007의 나머지(버킷 `blog`, 전용 키, `/media/*` 프록시, `minio` 클라이언트, `MINIO_*` env 이름)는 그대로다.

## Consequences

**좋아진 것**

- 앱 코드 변경 없이 compose의 `MINIO_URL`·network 이름만 바뀐다.
- 태그로 버전을 고정할 수 있다.

**감수한 것**

- env 이름은 `MINIO_*`인데 서버는 Garage다. 이름을 바꾸는 비용이 이득보다 커서 남긴다.
- `s3_region`을 `us-east-1`이 아닌 값으로 바꾸면 region을 지정하지 않은 `minio` 클라이언트의 서명이 깨질 수 있다.
- 버킷·키 관리는 `mc`가 아니라 `garage` CLI로 한다. 웹 콘솔이 없다.
- 단일 노드라 복제가 없다. 디스크를 잃으면 이미지를 잃으므로 데이터 디렉토리를 따로 백업해야 한다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| `cgr.dev/chainguard/minio` | 무료로는 `latest`만 받을 수 있어 버전을 고정할 수 없다 |
| `pgsty/minio` 등 커뮤니티 포크 이미지 | 유지 주체가 제3자라 장기 지원이 불확실하다 |
| MinIO를 소스에서 직접 빌드 | 업그레이드할 때마다 빌드·보안 패치 추적을 직접 해야 한다 |
| RustFS | 사용자 선택 시점에 성숙도가 Garage보다 낮다 |
