import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { redirect } from "next/navigation";

// login 이름은 바뀔 수 있으므로 GitHub 숫자 id로 판별한다. env가 비어 있으면 아무도 통과하지 못한다.
const isAdmin = (githubId: unknown) =>
  !!process.env.ADMIN_GITHUB_ID && String(githubId) === process.env.ADMIN_GITHUB_ID;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn: ({ profile }) => isAdmin(profile?.id),
    jwt({ token, profile }) {
      if (profile) token.githubId = String(profile.id);
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.githubId);
      return session;
    },
  },
});

// Server Action은 layout을 거치지 않는 별도 POST라서 action마다 직접 호출해야 한다 (ADR-0005).
export async function requireAdmin() {
  const session = await auth();
  if (!isAdmin(session?.user?.id)) redirect("/api/auth/signin");
  return session!;
}
