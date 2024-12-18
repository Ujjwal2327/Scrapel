import { cn } from "@/lib/utils";
import { SendToBack } from "lucide-react";
import Link from "next/link";

export function Logo({ fontSize = "text-2xl", iconSize = 20 }) {
  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2 select-none",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        <SendToBack size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Scrapel
        </span>
      </div>
    </Link>
  );
}
