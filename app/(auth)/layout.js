import { auth } from "@clerk/nextjs/server";
import { Logo } from "@/components/Logo";

export default async function Layout({ children }) {
  const { userId } = await auth();

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-4">
      {userId ? <Logo /> : <Logo href="/" />}

      {children}
    </div>
  );
}
