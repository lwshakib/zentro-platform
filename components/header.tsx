"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import router from "next/router";

export default function Header() {
  const { resolvedTheme } = useTheme();
  
  const router = useRouter();

  return (
    <header className="px-8 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-md sticky top-0 transition-all">
      <div className="flex items-center gap-3 cursor-pointer" onClick={()=> router.push("/")}>
        <Image
          src={resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"}
          alt="Zentro Logo"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="text-xl font-bold tracking-wide text-zinc-900 dark:text-white drop-shadow-sm">
          Zentro
        </span>
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white shadow-sm font-semibold px-6 py-2"
          >
            Launch App
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
