import { LucideIcon } from "lucide-react";

export type SideBarRoutedItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  slug: string;
  type: "routed";
};

export type DropdownItem = {
  title: string;
  url: string;
  slug: string;
  icon: LucideIcon;
  type: "dropdown";
  items?: SideBarRoutedItem[];
};

export type SeparatorBar = {
  type: "separator";
  title: string;
};