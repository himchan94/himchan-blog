# ADR-0007: 관리자 업로드 이미지는 공용 MinIO에 두고 앱의 /media/*로 서빙한다

- **Status**: Accepted
- **Date**: 2026-10-01
- **Domain**: admin

## Context

이미지는 `public/`이나 외부 URL만 쓸 수 있어서 글을 쓰다가 이미지를 넣으려면 배포가 필요했다.
관리자 화면에서 바로 올리고 본문·썸네일에 쓸 저장소가 필요하다. 같은 VPS의 다른 개인 프로젝트도 같은 MinIO를 쓴다.

## Decision

MinIO는 블로그 compose 밖, 서버에 따로 둔 공용 compose(`name: minio`, 루프백 바인딩)에서 돈다.
블로그는 버킷 `blog`와 그 버킷만 허용한 전용 키를 받아 쓰고, `app`은 외부 docker network(`MINIO_NETWORK`)로 붙는다.
업로드는 Server Action이 받아 `putObject`한다. 공개 URL은 `/media/{yyyy}/{mm}/{uuid}.{ext}`이고
Route Handler가 MinIO에서 읽어 스트리밍한다. 버킷은 private이다. 클라이언트는 `minio` 패키지를 쓴다.

## Consequences

**좋아진 것**

- 도메인이 하나라 nginx·인증서 추가 설정이 없고, MinIO는 외부에 열리지 않는다.
- 블로그를 `down`·`--remove-orphans`해도 다른 프로젝트의 저장소는 영향받지 않는다.
- 키에 UUID가 들어가 URL 내용이 바뀌지 않으므로 `immutable` 캐시를 붙인다.

**감수한 것**

- 버킷·키 생성은 서버에서 수동으로 한다. 전용 키에는 버킷 생성 권한이 없어 앱이 만들지 않는다.
- 공용 MinIO가 없으면 `app`이 뜨지 않는다(외부 network 필요).
- 이미지 트래픽이 Node를 거친다. 1인 블로그 규모라 받아들인다.
- Server Action body 한도를 11mb로 올렸다(파일 10MB + multipart 여유분).
- 글에서 지운 이미지가 버킷에 남는다. 정리는 필요해지면 한다.
- SVG는 같은 origin에서 스크립트를 실행할 수 있어 받지 않는다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| 블로그 compose 안에 MinIO | 다른 프로젝트와 같이 쓰면 블로그 compose 조작이 공용 저장소를 내린다 |
| 공용 MinIO compose를 이 repo에 | 다른 프로젝트의 인프라가 블로그 repo에 속하게 된다 |
| nginx 서브도메인 + public-read 버킷 | 서브도메인·인증서·nginx 설정을 따로 운영해야 한다 |
| 브라우저 → MinIO presigned PUT | MinIO를 외부에 열어야 한다 |
| 외주 프로젝트(hanwooltary) MinIO 공유 | 팀 공유 서버에 개인 데이터를 두지 않는다 |
| `@aws-sdk/client-s3` | 필요한 기능 대비 의존성이 크다 |
