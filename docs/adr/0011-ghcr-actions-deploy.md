# ADR-0011: main push 시 GitHub Actions가 이미지를 GHCR에 올리고 SSH로 서버에 배포시킨다

- **Status**: Accepted
- **Date**: 2026-10-14
- **Domain**: platform

## Context

ADR-0006은 레지스트리·CI 없이 VPS에서 이미지를 빌드했다. 서버가 생기고 배포를 자동화하기로 했다.
같은 2코어 VPS에 다른 프로젝트가 늘어날 예정이라 Next.js 빌드를 서버에서 돌리면 다른 서비스가 느려진다. repo는 public이다.

## Decision

main push(또는 수동 실행) 시 `.github/workflows/deploy.yml`이 app(runner 단계)과 migrate(deps 단계) 이미지를 빌드해
`ghcr.io/himchan94/himchan-blog[-migrate]`에 커밋 SHA와 `latest` 태그로 올린다. 패키지는 public이라 서버는 인증 없이 pull한다.
이어서 배포 전용 SSH 키로 서버에 SHA만 보낸다. 서버의 `authorized_keys`는 이 키를 `restrict,command="/srv/infra/deploy/himchan-blog.sh"`로 묶는다.
스크립트는 SHA 형식을 검증하고 repo를 그 커밋으로 `reset --hard`한 뒤 `IMAGE_TAG=<sha>`로 pull·`up -d --no-build`하고 헬스체크한다.

## Consequences

**좋아진 것**

- 서버에서 빌드하지 않는다. 배포할 때 서버가 하는 일은 pull과 컨테이너 교체뿐이다.
- 이미지와 compose 파일이 같은 커밋에 고정된다. 이전 SHA로 워크플로를 다시 돌리거나 스크립트에 넘기면 롤백이다.
- 배포 키가 유출돼도 임의 명령은 실행되지 않는다. 할 수 있는 일은 이미 push된 커밋으로 재배포하는 것뿐이다.

**감수한 것**

- 서버 repo는 배포 때마다 `reset --hard`된다. 서버에서 추적 파일을 직접 고치면 다음 배포에서 사라진다(`.env`는 추적 대상이 아니라 남는다).
- main에 push할 수 있으면 서버에서 docker를 다룰 수 있다(compose 파일을 바꿀 수 있으므로). 1인 repo라 받아들인다.
- 컨테이너를 교체하는 몇 초 동안 접속이 끊긴다.
- GHCR 패키지가 public이라 빌드 결과물을 누구나 받을 수 있다. 빌드에 시크릿이 들어가지 않는다는 전제(`.dockerignore`의 `.env*`, `NEXT_PUBLIC_*` 미사용)를 지켜야 한다.
- 배포 스크립트는 서버(`/srv/infra/deploy`)에만 있다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| Actions → SSH → 서버에서 빌드 (ADR-0006 유지) | 빌드 CPU가 같은 서버의 다른 프로젝트와 겹친다 |
| 서버에 self-hosted runner | public repo의 워크플로 코드가 서버에서 실행된다 |
| 서버 cron으로 `latest` 주기 pull | 반영이 늦고, 배포 결과를 Actions에서 볼 수 없다 |
| private 패키지 + 서버에 read 토큰 | 이미지에 비밀이 없어 토큰 관리 비용만 생긴다 |
| 배포 스크립트를 repo에 두고 forced command로 지정 | 스크립트가 자기 자신을 `reset`으로 바꾸게 되고, push만으로 배포 경로를 바꿀 수 있다 |
