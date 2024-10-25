import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const QnA: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-11/12 max-w-4xl mx-auto">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Starter?</AccordionTrigger>
        <AccordionContent>
          Starter is a project starter kit that helps you launch your next
          project faster.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does Starter help?</AccordionTrigger>
        <AccordionContent>
          Starter provides a pre-configured environment with essential tools and
          components, saving you time in project setup and allowing you to focus
          on building your unique features.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if
          you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};