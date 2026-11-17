import type { Metadata } from 'next';

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/components/common/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { FAQ_SECTIONS } from '@/constants/faq';

export const metadata: Metadata = {
  title: 'FAQ',
};

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div className="mx-auto flex max-w-220 flex-col gap-8">
      <JsonLd data={FAQ_STRUCTURED_DATA} />
      <div className="flex flex-col gap-2">
        <h1 className="text-t2 text-text-default">FAQ</h1>
        <p className="text-b2 text-text-sub">
          피드배커를 이용하면서 자주 묻는 질문을 모았습니다.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {FAQ_SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-h2 text-text-default">{section.title}</h2>
            <Accordion
              className="rounded-2xl border border-gray-300 bg-white px-7"
              defaultValue={[]}
            >
              {section.items.map((item, index) => (
                <AccordionItem key={item.question} value={index}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionPanel>{item.answer}</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
