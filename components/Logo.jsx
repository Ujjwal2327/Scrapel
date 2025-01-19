"use client";
import Link from "next/link";
import { Network, SendToBack } from "lucide-react";
import { cn, handleScroll } from "@/lib/utils";

export function Logo({
  href = "/workflows",
  fontSize = "text-2xl",
  iconSize = 20,
  id = null,
}) {
  if (id)
    return (
      <div
        onClick={() => handleScroll(id)}
        className={cn(
          "text-2xl font-extrabold flex items-center gap-2 select-none cursor-pointer",
          fontSize
        )}
      >
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
          <SendToBack size={iconSize} className="stroke-white" />
          {/* <Network size={iconSize} className="stroke-white -rotate-90" /> */}{" "}
        </div>
        <div>
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Scrapel
          </span>
        </div>
      </div>
    );

  return (
    <Link
      href={href}
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2 select-none",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        <SendToBack size={iconSize} className="stroke-white" />
        {/* <Network size={iconSize} className="stroke-white -rotate-90" /> */}
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Scrapel
        </span>
      </div>
    </Link>
  );
}
