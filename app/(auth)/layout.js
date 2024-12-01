import { Logo } from "@/components/logo";

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-4">
      <Logo />
      {children}
    </div>
  );
}
