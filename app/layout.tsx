import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "allaboutecu | Commercial Vehicle Intelligence",
  description: "상용차 시장과 ECU 기술을 한곳에서 탐색하는 인텔리전스 워크스페이스",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
