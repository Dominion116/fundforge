import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faq = [
  {
    question: "What is milestone-based funding?",
    answer:
      "Milestone-based funding releases funds to creators in stages as they complete specific project goals. This protects backers by ensuring progress is made before all capital is unlocked.",
  },
  {
    question: "How do I start a campaign?",
    answer:
      "Connect your wallet, click 'Create Project', and fill in your campaign details including funding goals, milestones, and timelines. Once submitted, your campaign goes live on the blockchain.",
  },
  {
    question: "Is my contribution refundable?",
    answer:
      "Yes, if a project fails to meet its soft cap or if a creator fails to validate a milestone, remaining funds can be refunded to contributors via the smart contract.",
  },
  {
    question: "What currencies do you accept?",
    answer:
      "FundForge currently accepts ETH and USDC on supported networks. We are working on integrating more tokens and cross-chain support in the future.",
  },
  {
    question: "Are there platform fees?",
    answer:
      "We charge a small percentage fee on successful campaigns to maintain the platform and develop new features. Gas fees for transactions are determined by the network.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 rounded-none py-1 border-border">
            ✦ FAQ
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-muted-foreground">
            Everything you need to know about FundForge and decentralized crowdfunding.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="question-0">
          {faq.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`question-${index}`} className="border bg-card/50 backdrop-blur-sm px-6 rounded-lg">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
