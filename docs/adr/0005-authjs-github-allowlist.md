# ADR-0005: 관리자 인증은 Auth.js v5 + GitHub OAuth, GitHub id 한 개만 허용하고 JWT 세션을 쓴다

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: admin

## Context

관리자는 본인 1명이다. 비밀번호를 직접 관리하고 싶지 않다.
2026-09 기준 `next-auth` v5는 여전히 beta(5.0.0-beta.32)이고, Auth.js는 Better Auth에 합류했다고 공지했다.
Next 15.2.2에서 middleware만으로 인증을 거는 구조가 CVE-2025-29927로 우회된 적이 있다.

## Decision

`next-auth@5.0.0-beta.32`(정확 버전 고정)와 GitHub provider를 쓴다(`src/auth.ts`).
`signIn` 콜백에서 GitHub 숫자 id가 `ADMIN_GITHUB_ID`와 같을 때만 통과시킨다. env가 비면 아무도 통과하지 못한다.
세션은 JWT이고 DB 어댑터를 쓰지 않는다.
보호는 proxy(middleware)에 두지 않고 `requireAdmin()`을 직접 호출한다:
admin layout, **모든 admin page와 Server Action의 첫 줄**, 관리자용 Route Handler.
page에도 두는 이유: soft navigation에서는 layout이 다시 렌더되지 않을 수 있어 layout 검사만으로는 page 데이터를 보호하지 못한다.

## Consequences

**좋아진 것**

- 인증용 테이블과 비밀번호 저장이 없다.
- 경계가 요청 처리 코드 안에 있어 proxy 우회로 뚫리지 않는다.

**감수한 것**

- beta 버전에 의존한다. 업그레이드 시 API 변경을 확인해야 한다.
- Server Action을 새로 만들 때 `requireAdmin()` 호출을 빠뜨리면 그대로 열린다(layout 검사는 action에 적용되지 않는다).
- `ADMIN_GITHUB_ID`를 바꿔도 이미 발급된 JWT는 `requireAdmin()`의 id 재확인으로만 막힌다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| Better Auth | 사용자가 Auth.js를 선택했다. v5가 깨지면 1순위 교체 후보 |
| ID/PW 단일 계정 | 비밀번호 해시·세션을 직접 구현해야 한다 |
| proxy.ts에서 `/admin` 일괄 차단 | 단독 경계로는 CVE-2025-29927 같은 우회에 취약하다. 필요하면 보조로만 추가한다 |
| login 이름으로 허용 | GitHub login은 바꿀 수 있고, 바뀐 이름을 다른 사람이 가져갈 수 있다 |
