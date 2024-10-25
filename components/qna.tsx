import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const QnA: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-11/12 max-w-4xl mx-auto">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Vyapaar?</AccordionTrigger>
        <AccordionContent>
          Vyapaar is a AI integrated CRM that helps you manage your customers with ease.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does Vyapaar help?</AccordionTrigger>
        <AccordionContent>
          Vyapaar provides a pre-configured environment with essential tools and
          components, saving you time in customer management and allowing you to focus
          on building your unique features.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it AI integrated?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with LLama, a top tier LLM model.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is it secure?</AccordionTrigger>
        <AccordionContent>
          Yes. Alot.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};