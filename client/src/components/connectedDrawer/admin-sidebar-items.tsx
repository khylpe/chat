import type { SidebarItem } from "./sidebar";

import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { sectionItems } from "./sidebar-items";

export const adminSectionItems: SidebarItem[] = [
       ...sectionItems, // Spread the sectionItems here to include them at the start
       // {
       //        key: "administration",
       //        title: "Administration",
       //        items: [
       //               {
       //                      key: "cap_table",
       //                      href: "/cap_table",
       //                      title: "Cap Table",
       //                      icon: "solar:pie-chart-2-outline",
       //                      items: [
       //                             {
       //                                    key: "shareholders",
       //                                    href: "/cap_table=shareholders",
       //                                    title: "Shareholders",
       //                             },
       //                             {
       //                                    key: "note_holders",
       //                                    href: "/cap_table=note_holders",
       //                                    title: "Note Holders",
       //                             },
       //                             {
       //                                    key: "transactions_log",
       //                                    href: "/cap_table=transactions_log",
       //                                    title: "Transactions Log",
       //                             },
       //                      ],
       //               },
       //               {
       //                      key: "analytics",
       //                      href: "/analytics",
       //                      icon: "solar:chart-outline",
       //                      title: "Analytics",
       //               },
       //               {
       //                      key: "perks",
       //                      href: "/perks",
       //                      icon: "solar:gift-linear",
       //                      title: "Perks",
       //                      endContent: (
       //                             <Chip size="sm" variant="flat">
       //                                    3
       //                             </Chip>
       //                      ),
       //               },
       //               {
       //                      key: "expenses",
       //                      href: "/expenses",
       //                      icon: "solar:bill-list-outline",
       //                      title: "Expenses",
       //               },
       //               {
       //                      key: "settings",
       //                      href: "/settings",
       //                      icon: "solar:settings-outline",
       //                      title: "Settings",
       //               },
       //        ],
       // },
];