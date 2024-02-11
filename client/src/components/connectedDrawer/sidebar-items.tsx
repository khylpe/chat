import type { SidebarItem } from "./sidebar";

import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export const sectionItems: SidebarItem[] = [
       {
              key: "overview",
              title: "Overview",
              items: [
                     {
                            key: "home",
                            href: "/home",
                            icon: "solar:home-2-linear",
                            title: "Home",
                     },
                     {
                            key: "projects",
                            href: "/projects",
                            icon: "solar:widget-2-outline",
                            title: "Projects",
                            endContent: (
                                   <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
                            ),
                     },
                     {
                            key: "tasks",
                            href: "/tasks",
                            icon: "solar:checklist-minimalistic-outline",
                            title: "Tasks",
                            endContent: (
                                   <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
                            ),
                     },
                     {
                            key: "team",
                            href: "/team",
                            icon: "solar:users-group-two-rounded-outline",
                            title: "Team",
                     },
                     {
                            key: "tracker",
                            href: "/tracker",
                            icon: "solar:sort-by-time-linear",
                            title: "Tracker",
                            endContent: (
                                   <Chip size="sm" variant="flat">
                                          New
                                   </Chip>
                            ),
                     },
              ],
       },
       {
              key: "organization",
              title: "Organization",
              items: [
                     {
                            key: "cap_table",
                            href: "/cap_table",
                            title: "Cap Table",
                            icon: "solar:pie-chart-2-outline",
                            items: [
                                   {
                                          key: "shareholders",
                                          href: "/cap_table=shareholders",
                                          title: "Shareholders",
                                   },
                                   {
                                          key: "note_holders",
                                          href: "/cap_table=note_holders",
                                          title: "Note Holders",
                                   },
                                   {
                                          key: "transactions_log",
                                          href: "/cap_table=transactions_log",
                                          title: "Transactions Log",
                                   },
                            ],
                     },
                     {
                            key: "analytics",
                            href: "/analytics",
                            icon: "solar:chart-outline",
                            title: "Analytics",
                     },
                     {
                            key: "perks",
                            href: "/perks",
                            icon: "solar:gift-linear",
                            title: "Perks",
                            endContent: (
                                   <Chip size="sm" variant="flat">
                                          3
                                   </Chip>
                            ),
                     },
                     {
                            key: "expenses",
                            href: "/expenses",
                            icon: "solar:bill-list-outline",
                            title: "Expenses",
                     },
                     {
                            key: "settings",
                            href: "/settings",
                            icon: "solar:settings-outline",
                            title: "Settings",
                     },
              ],
       },
];