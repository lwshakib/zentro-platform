"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTable } from "@clerk/nextjs";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  if (!resolvedTheme) return null;

  useEffect(() => {
    if (window.location.hash === "#pricing" && pricingRef.current) {
      const y =
        pricingRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Header */}
   <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 pt-24 pb-12">
        <h2 className="text-5xl font-bold max-w-4xl text-zinc-900 dark:text-white">
          Automate Your YouTube Journey with AI-Powered Tools
        </h2>

        <p className="text-lg text-zinc-700 dark:text-zinc-300 mt-6 max-w-xl">
          Streamline your entire YouTube workflow from content creation to
          publishing with our comprehensive automation platform.
        </p>

        <div className="mt-8">
          <Link href={"/dashboard"}>
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* <img
          src="/images/app-preview.png"
          alt="App Preview"
          className="mt-16 rounded-xl shadow-2xl w-full max-w-5xl"
        /> */}
      </main>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {[
          "Content Planning",
          "AI Script Generation",
          "Video Creation",
          "Auto Publishing",
          "Analytics & Insights",
          "Channel Growth",
        ].map((feature, index) => (
          <Card
            key={feature}
            className="bg-white/5 dark:bg-zinc-900 border-none shadow-xl"
          >
            <CardHeader className="flex flex-col items-center">
              <CheckCircle className="text-green-400 mb-4" size={32} />
              <CardTitle className="text-xl font-semibold mb-2 text-center dark:text-white text-zinc-900">
                {feature}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-400 text-center">
                Plan your content strategy and discover trending topics to
                maximize your reach and engagement.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 max-w-2xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does Zentro automate my YouTube journey?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our platform streamlines your entire YouTube workflow from
                content planning to publishing, using AI to generate scripts,
                create videos, and manage your channel growth automatically.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I edit videos before publishing?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Yes! You can preview, edit, and optimize your videos before
                scheduling or uploading.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a free trial?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Absolutely. Get started for free and explore all core features
                before upgrading.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What languages are supported?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We support English and are working on adding more languages
                soon.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-10 text-center">
          <span className="text-gray-500 dark:text-gray-500">
            Still have questions?
          </span>
          <Button className="ml-3" size="sm" variant="outline">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-zinc-900">
        <h2 className="text-3xl font-bold text-center mb-10 text-zinc-900 dark:text-white">
          What Creators Are Saying
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "This tool saved me hours!",
              name: "Alex Kim",
              tag: "YouTuber",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              quote: "My views skyrocketed!",
              name: "Priya Singh",
              tag: "Content Creator",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              quote: "Now I focus only on creativity!",
              name: "Carlos Rivera",
              tag: "Shorts Producer",
              avatar: "https://randomuser.me/api/portraits/men/65.jpg",
            },
          ].map((t, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex flex-col items-center p-6 rounded-xl shadow-sm"
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-14 h-14 rounded-full mb-3 object-cover border border-gray-300 dark:border-zinc-600"
              />
              <CardContent className="text-gray-700 dark:text-gray-200 text-center mb-3 text-base font-normal">
                "{t.quote}"
              </CardContent>
              <div className="mt-1 flex flex-col items-center">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {t.tag}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        ref={pricingRef}
        id="pricing"
        className="py-20 px-6 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-white">
          Simple, Transparent Pricing
        </h2>
        <PricingTable />
      </section>

      {/* Call to Action */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-green-950 transition-colors">
        {/* Decorative Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold shadow-md animate-bounce">
            🚀 New for 2025!
          </span>
        </div>
        <h2 className="text-4xl font-bold mb-3 text-zinc-900 dark:text-white drop-shadow-lg">
          Ready to Scale Your YouTube Channel?
        </h2>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-xl mx-auto">
          Join thousands of creators automating their YouTube journey. Start for
          free—no credit card required!
        </p>
        <Button
          size="lg"
          className="text-white bg-green-600 hover:bg-green-700 shadow-lg relative animate-pulse focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center">
            Join Now for Free <ArrowRight className="ml-2 w-4 h-4" />
          </span>
          {/* Glowing effect */}
          <span
            className="absolute inset-0 rounded-lg bg-green-400 opacity-30 blur-lg animate-ping z-0"
            aria-hidden="true"
          ></span>
        </Button>
        {/* Decorative sparkles */}
        <svg
          className="absolute left-10 top-10 w-12 h-12 opacity-30 text-green-400 animate-spin-slow"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0-1.42-1.42M6.34 6.34 4.92 4.92"
          />
        </svg>
        <svg
          className="absolute right-10 bottom-10 w-10 h-10 opacity-20 text-green-300 animate-spin-reverse"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
