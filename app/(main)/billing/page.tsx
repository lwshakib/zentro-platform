import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingTable } from "@clerk/nextjs";

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your YouTube automation needs. Start free
          and upgrade as you grow.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <PricingTable />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl text-center font-semibold mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What's included in the free plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The free plan includes basic video generation, limited thumbnail
                creation, and access to core features to get you started.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I upgrade or downgrade my plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you can change your plan at any time. Changes take effect
                immediately and are prorated.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Is there a money-back guarantee?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a 30-day money-back guarantee on all paid plans. If
                you're not satisfied, we'll refund your payment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does billing work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Billing is handled securely through Stripe. You can manage your
                subscription, update payment methods, and view billing history
                from your account settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American
                Express) and PayPal. All payments are processed securely through
                Stripe.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
