import { Logo } from "@/components/Logo";

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-4">
      <Logo />
      {children}
    </div>
  );
}
