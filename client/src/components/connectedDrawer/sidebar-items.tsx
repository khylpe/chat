import type { SidebarItem } from "./sidebar";

import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export const sectionItems: SidebarItem[] = [
       {
              key: "home",
              href: "/home",
              icon: "solar:home-2-linear",
              title: "Home",
       },
       {
              key: "rooms",
              title: "Rooms",
              items: [
                     {
                            key: "my_rooms",
                            href: "/my_rooms",
                            icon: "solar:home-2-linear",
                            title: "My rooms",
                     },
                     {
                            key: "join_room",
                            href: "/join_room",
                            icon: "solar:login-linear",
                            title: "Join room"
                     },
                     {
                            key: "create_room",
                            href: "/create_room",
                            icon: "solar:add-circle-linear",
                            title: "Create room",
                     },
              ],
       },
];