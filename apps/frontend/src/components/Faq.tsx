import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do credits work?",
    answer:
      "Each image generation consumes credits based on the selected AI model. More advanced models may use more credits.",
  },
  {
    question: "Do my credits expire?",
    answer:
      "No. Purchased credits never expire and remain in your account until you use them.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds are available only if credits haven't been used. Once image generation has started, unused credits are generally non-refundable.",
  },
  {
    question: "Which payment methods are supported?",
    answer:
      "We securely accept UPI, credit cards, debit cards, net banking, and other payment methods through Razorpay.",
  },
];

export default function Faq() {
  // Base UI expects an array
  const [value, setValue] = useState<string[]>(["item-0"]);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-14 text-center">
          <span className="inline-flex gap-2 border-gray-200 shadow-md bg-gray-50 items-center rounded-full border px-4 py-1 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Everything you
            <span className="text-primary"> need to know</span>
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Answers to the most common questions about credits, payments and
            image generation.
          </p>
        </div>

        <Accordion
          value={value}
          onValueChange={setValue}
          className="rounded-2xl border bg-background p-6"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="pb-5 leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <a
            href="mailto:support@lumiforge.ai"
            className="font-medium text-primary hover:underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
