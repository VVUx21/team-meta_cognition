import { Bitcoin, ChartBar, ChartColumnBig, ChartLine, Gauge, Eye, Blinds, type LucideIcon, MessagesSquare, SquareUser } from "lucide-react";

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
    href: "/mutualFund",
  },
  {
    icon: ChartBar,
    name: "Stocks",
    href: "/stocks",
  },
  {
    icon: ChartColumnBig,
    name: "Ongoing Trend",
    href: "/realtime-trend",
  },
  {
    icon: SquareUser,
    name: "Demat",
    href: "/demat",
  },
  {
    icon: Eye,
    name: "My Watchklist",
    href: "/watchlist",
  },
   {
    icon: Blinds,
    name: "Holdings",
    href: "/holdings",
  }
];
