const QA_GUIDE_ITEMS = [
  {
    title: '내 서비스의 QA 참여자 모집',
    description:
      '직접 만든 웹이나 앱을 등록하고 테스트가 필요한 부분을 알려주세요. 다른 메이커의 실제 사용 경험을 바탕으로 버그와 사용성 피드백을 받을 수 있어요.',
  },
  {
    title: '다른 프로젝트의 유저 테스트 참여',
    description:
      '관심 있는 사이드 프로젝트를 직접 사용해 보고 구체적인 피드백을 남겨보세요. 참여로 모은 도토리는 내 프로젝트의 QA를 모집할 때 사용할 수 있어요.',
  },
] as const;

function QaSeoGuide() {
  return (
    <section
      aria-labelledby="qa-guide-title"
      className="mt-16 rounded-2xl bg-gray-50 p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 id="qa-guide-title" className="text-t3 text-text-default">
          사이드 프로젝트 유저 테스트와 QA, 함께 진행해 보세요
        </h2>
        <p className="text-b2 max-w-180 text-text-sub">
          Feedbacker는 개발자, 디자이너, 기획자 등 메이커들이 서로의
          서비스를 테스트하고 피드백을 주고받는 QA 품앗이 플랫폼이에요.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {QA_GUIDE_ITEMS.map((item) => (
          <article
            key={item.title}
            className="rounded-xl bg-white p-5"
          >
            <h3 className="text-h3 text-text-default">{item.title}</h3>
            <p className="text-b2 mt-2 text-text-sub">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export { QaSeoGuide };
