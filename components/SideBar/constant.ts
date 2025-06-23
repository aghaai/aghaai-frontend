import { FlaskRound, PanelLeftDashed } from "lucide-react";
import { DropdownItem, SeparatorBar, SideBarRoutedItem } from "./types";

export const sideBarLinks: (DropdownItem | SideBarRoutedItem | SeparatorBar)[] =
  [
    {
      title: "Dashboard",
      type: "routed",
      url: "/",
      slug: "/",
      icon: PanelLeftDashed,
    },
    {
      title: "Essay Evaluation",
      type: "routed",
      url: "/essay-evaluation",
      slug: "/essay-evaluation",
      icon: FlaskRound,
    },
    // {
    //   type: "separator",
    //   title: "Settings",
    // },
  ];
