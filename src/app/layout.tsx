import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Feedbaker",
    template: "%s | Feedbaker", // 페이지별 title을 설정할때 사용되는 템플릿
  },
  description:
    "만든 서비스를 홍보하고, 실제 사용자에게 피드백과 테스트를 받는 플랫폼입니다.",
  metadataBase: new URL("http://localhost:3000"), // 추후 배포 시 도메인 주소로 변경 필요
  openGraph: {
    title: "Feedbaker",
    description:
      "만든 서비스를 홍보하고, 실제 사용자에게 피드백과 테스트를 받는 플랫폼입니다.",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og_image.png", // 카카오톡 링크 공유 시 표시되는 이미지 
        width: 1200,
        height: 630,
        alt: "Feedbaker",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <div className="flex h-screen p-3 gap-3">
          <div className="w-60 shrink-0 border border-gray-300">Gnb</div>
          <div className="flex flex-1 flex-col min-w-0 gap-3">
            <header className="border border-gray-300">Header</header>
            <div className="flex-1 min-h-0 border border-gray-300">{children}</div>
          </div>
        </div>
        <footer className="bg-rust-50">Footer</footer>
      </body>
    </html>
  );
}
