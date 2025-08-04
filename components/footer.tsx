"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  return (
    <footer className="text-sm text-gray-500 dark:text-gray-400 text-center py-10 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={
                resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"
              }
              alt="Zentro Logo"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-bold text-lg dark:text-white text-zinc-900">
              Zentro
            </span>
          </div>
          <span className="mb-2">Automate your YouTube journey with us.</span>
          <div className="flex gap-3 mt-2">
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-red-500">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a2.993 2.993 0 0 0-2.107-2.117C19.24 3.5 12 3.5 12 3.5s-7.24 0-9.391.569A2.993 2.993 0 0 0 .502 6.186C0 8.338 0 12 0 12s0 3.662.502 5.814a2.993 2.993 0 0 0 2.107 2.117C4.76 20.5 12 20.5 12 20.5s7.24 0 9.391-.569a2.993 2.993 0 0 0 2.107-2.117C24 15.662 24 12 24 12s0-3.662-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="#" aria-label="Email" className="hover:text-green-400">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 13.065 2.4 6.6A2 2 0 0 1 4 4h16a2 2 0 0 1 1.6 2.6l-9.6 6.465zm9.6 1.335-7.68 5.175a2 2 0 0 1-2.4 0L2.4 14.4A2 2 0 0 1 2 13.065V6.935l9.6 6.465 9.6-6.465v6.13a2 2 0 0 1-.4 1.335z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link
            href="#"
            className="hover:underline dark:text-white text-zinc-900"
          >
            About
          </Link>
          <Link
            href="#"
            className="hover:underline dark:text-white text-zinc-900"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="hover:underline dark:text-white text-zinc-900"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="hover:underline dark:text-white text-zinc-900"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} Zentro. All rights reserved.
      </div>
    </footer>
  );
}
