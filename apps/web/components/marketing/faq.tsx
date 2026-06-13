import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    id: "item-1",
    question: "What is AgentCN?",
    answer: [
      "AgentCN is an open source kit for adding AI agents to your app. Agents publish through a CLI and registry. You install the source into your repo and change behavior by editing code, not by flipping switches in someone else's dashboard.",
    ],
  },
  {
    id: "item-2",
    question: "Is it free to use?",
    answer: [
      "Yes. The core project is open source. You can install agents, run them locally in mock mode, and ship them in your own product without paying AgentCN.",
      "If you want a full starter app with auth and a database, the AgentKit template is also open source on GitHub.",
    ],
  },
  {
    id: "item-3",
    question: "How much can I change?",
    answer: [
      "As much as you want. Each agent includes prompts, tools, schemas, and example usage. Because the code lives next to your app, changes go through the same review process as any other feature.",
    ],
  },
  {
    id: "item-4",
    question: "What stack does it use?",
    answer: [
      "TypeScript and the Vercel AI SDK. Agents support mock mode for local development and provider adapters when you connect live models and external tools.",
    ],
  },
  {
    id: "item-5",
    question: "How do I get started?",
    answer: [
      "Open the docs, pick an agent from the registry, and run the install command shown on its page. Try mock mode first, then add your keys and tune prompts or tools for your product.",
    ],
  },
  {
    id: "item-6",
    question: "Will more agents be added?",
    answer: [
      "Yes. The registry is meant to grow over time. New agents land with docs, install steps, and previews. You can suggest ideas or report gaps in GitHub discussions.",
    ],
  },
]

export function FAQ() {
  return (
    <section className="from-background via-secondary/60 to-background bg-gradient-to-b from-20% py-16 md:py-32">
      <div className="container mx-auto flex w-full max-w-6xl flex-col items-center justify-start !px-4 text-center">
        <h2 className="leading-tighter font-gilroy max-w-2xl bg-gradient-to-b from-white/80 via-white to-white/60 bg-clip-text pb-2 text-5xl font-semibold tracking-tight text-pretty text-transparent lg:leading-[1.1] lg:font-semibold xl:text-6xl/[4rem] xl:tracking-tighter">
          Questions
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base text-balance sm:text-lg">
          How the CLI, registry, and agent docs fit together.
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
