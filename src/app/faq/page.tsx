import type { Metadata } from 'next';

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/components/common/Accordion';

export const metadata: Metadata = {
  title: 'FAQ',
};

const FAQ_SECTIONS = [
  {
    title: '📍 서비스 이용',
    items: [
      {
        question: '피드배커는 어떤 서비스인가요?',
        answer:
          '피드배커는 웹/앱 서비스의 메이커들이 서로의 서비스를 테스트해주고 피드백을 주고받으며 함께 성장하는 품앗이 QA 플랫폼입니다.',
      },
      {
        question: '이용 요금은 무료인가요?',
        answer:
          '네. 피드배커의 기본 이용 및 QA 모집, 참여는 전부 무료로 제공됩니다.',
      },
    ],
  },
  {
    title: '🌰 도토리',
    items: [
      {
        question: '도토리는 무엇이고 어떻게 얻나요?',
        answer:
          '도토리는 피드배커 내에서 사용하는 포인트입니다. 다른 메이커의 QA에 참여해 피드백을 작성하고, 해당 메이커가 피드백을 수락하면 보상으로 도토리를 획득할 수 있습니다.',
      },
      {
        question: '도토리는 어디에 사용하나요?',
        answer:
          '모은 도토리는 내 프로젝트의 QA 모집 글을 올릴 때 테스터에게 지급할 보상으로 사용됩니다.',
      },
      {
        question: '도토리를 현금으로 구매하거나 환전할 수 있나요?',
        answer: '현재 도토리는 피드백 작성을 통해서만 획득 가능합니다.',
      },
    ],
  },
  {
    title: '⚒️ QA 모집 및 피드백 검토',
    items: [
      {
        question: 'QA 모집 글은 바로 올릴 수 있나요?',
        answer:
          "QA 모집 글을 올리기 위해서는 먼저 프로젝트 등록이 완료되어야 합니다. '프로젝트 등록'을 통해 내 서비스의 기본 정보를 먼저 등록해 주세요. 이후에 등록된 내 프로젝트에 대한 QA 모집 글을 게시할 수 있습니다.",
      },
      {
        question: '제출된 피드백의 수락/거절 기준은 어떻게 되나요?',
        answer:
          '질문 목적에 맞게 성의 있게 작성된 피드백은 수락하여 도토리를 지급해 주세요. 성의가 없거나 질문과 상관없는 답변은 거절 처리할 수 있습니다.',
      },
      {
        question: '피드백을 거절하면 어떻게 되나요?',
        answer:
          '거절 처리 시 해당 테스터에게 보상 도토리가 지급되지 않습니다. 단, 건전한 커뮤니티 유지를 위해 무분별한 거절은 자제해 주세요.',
      },
    ],
  },
  {
    title: '✍️ QA 참여',
    items: [
      {
        question: 'QA 참여는 어떻게 하나요?',
        answer:
          '모집 중인 QA 중에서 관심 있는 글을 선택하여 참여한 뒤, 메이커가 입력한 문항과 작성 가이드에 맞춰 피드백을 작성해 주시면 됩니다.',
      },
      {
        question: '피드백을 작성했는데 도토리가 바로 지급되지 않아요.',
        answer:
          '메이커가 피드백 내용을 검토한 후 수락 처리를 완료해야 도토리가 지급됩니다. 메이커가 검토를 완료할 때까지 조금만 기다려 주세요.',
      },
      {
        question: '작성한 피드백이 부당하게 거절됐을 경우에는 어떻게 하나요?',
        answer:
          '거절 처리가 부당하다고 느껴지신다면 이의를 제기할 수 있습니다. [마이페이지 - 내 QA 참여]에서 해당 항목의 이의제기 접수를 진행할 수 있습니다. 접수가 완료되면, 운영진이 피드백 내용과 거절 사유를 신중히 검토한 후 부당한 거절로 확인되면 도토리를 정상 지급해 드립니다.',
      },
    ],
  },
  {
    title: '❓ 계정 및 기타 문의',
    items: [
      {
        question: '프로필 수정이나 회원 탈퇴는 어떻게 하나요?',
        answer:
          '[마이페이지 - 프로필 수정하기]에서 프로필 수정 및 회원 탈퇴가 가능합니다.',
      },
      {
        question: '버그 제보나 기타 문의사항은 어디로 연락해야 하나요?',
        answer:
          '운영팀 이메일(feedbacker.dev@gmail.com)로 연락 주시면 빠르게 안내해 드리겠습니다.',
      },
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <div className="mx-auto flex max-w-220 flex-col gap-8">
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
