import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    id: "item-1",
    question:
      "What is AgentCN and how is it different from typical AI tools?",
    answer: [
      "AgentCN is an open-source library of reusable, installable AI agents for real business workflows. Instead of consuming a black-box SaaS feature, you install agent code directly into your project.",
      "You can inspect, customize, and evolve each agent over time, which gives your team long-term control and maintainability.",
    ],
  },
  {
    id: "item-2",
    question: "Is AgentCN free and open source?",
    answer: [
      "Yes. The core library is open source and built to be transparent. You can use and adapt the code for real products.",
      "Our model is based on added value like advanced templates, custom implementation, and future hosted capabilities-not lock-in.",
    ],
  },
  {
    id: "item-3",
    question: "How customizable are the agents?",
    answer: [
      "Each agent includes prompts, tools, schemas, adapters, and example usage so your team can change behavior at every layer.",
      "Because the code lives in your codebase, customization is straightforward and versioned with the rest of your product.",
    ],
  },
  {
    id: "item-4",
    question: "What tech stack does AgentCN target?",
    answer: [
      "AgentCN is TypeScript-first and optimized for modern Next.js and Node.js applications, with Vercel AI SDK and modular provider adapters.",
      "We prioritize practical developer experience: clear structure, mock/demo mode, and integration paths that work in real production codebases.",
    ],
  },
  {
    id: "item-5",
    question: "How do I get started with an agent?",
    answer: [
      "Install an agent via CLI, copy it into your project, and run it with mock mode enabled for immediate local testing.",
      "Then customize prompts and tools to your workflow, wire in your provider keys, and ship it as part of your product.",
    ],
  },
]

export function FAQ() {
  return (
    <section className="from-background via-secondary/60 to-background bg-gradient-to-b from-20% py-16 md:py-32">
      <div className="container mx-auto flex w-full max-w-6xl flex-col items-center justify-start !px-4 text-center">
        <h2 className="leading-tighter font-gilroy max-w-2xl bg-gradient-to-b from-white/80 via-white to-white/60 bg-clip-text pb-2 text-5xl font-semibold tracking-tight text-pretty text-transparent lg:leading-[1.1] lg:font-semibold xl:text-6xl/[4rem] xl:tracking-tighter">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base text-balance sm:text-lg">
          Common questions about installing, customizing, and scaling reusable AI agents.
        </p>
      </div>
      <div className="container mx-auto mt-10 max-w-3xl !px-4 md:mt-14">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {faqData.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-secondary/60 p-1.5"
            >
              <AccordionTrigger className="px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground flex flex-col gap-4 px-2 py-4 text-balance">
                {faq.answer.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
