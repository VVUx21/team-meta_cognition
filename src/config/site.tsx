import { Bitcoin, ChartColumnBig, ChartLine, Gauge, type LucideIcon, MessagesSquare, SquareUser } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Metafin",
  description: "Your Personal Finance Assistant",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: ChartLine,
    name: "Mutual Funds",
    href: "/mutual-funds",
  },
  {
    icon: ChartColumnBig,
    name: "Stocks",
    href: "/stocks",
  },
  {
    icon: Bitcoin,
    name: "Crypto",
    href: "/crypto",
  },
  {
    icon: SquareUser,
    name: "Demat",
    href: "/demat",
  }
];
