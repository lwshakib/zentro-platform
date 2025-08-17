"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-zinc-200 dark:text-zinc-800 select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="max-w-md mb-8">
          <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/dashboard">
            <Button size="lg" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="max-w-md">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-500 mb-2">
            <Search className="w-4 h-4" />
            <span>Looking for something specific?</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Try navigating to the dashboard or check our main page for the
            features you need.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-100/20 to-blue-100/20 dark:from-green-900/10 dark:to-blue-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-full blur-3xl"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
