import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqAccordionItem {
  id: string;
  question: string;
  /** Plain copy or JSX — answers may carry inline links. */
  answer: ReactNode;
}

interface FaqAccordionProps {
  items: FaqAccordionItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => (
  <Accordion type="multiple" className="mt-2 w-full">
    {items.map(({ id, question, answer }) => (
      <AccordionItem
        key={id}
        value={id}
        className="mb-2 overflow-hidden rounded-sm bg-secondary shadow-md transition-colors hover:bg-secondary/70"
      >
        <AccordionTrigger className="px-4 text-left text-base font-semibold text-foreground hover:no-underline">
          {question}
        </AccordionTrigger>
        <AccordionContent className="px-4 text-sm text-foreground/90">
          {answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
