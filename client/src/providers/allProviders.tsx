import { ReactNode } from "react";

import NextUIProvider from "./nextuiProvider";
import ThemeProvider from "./themeProvider";

export default function AllProviders({ children }: { children: ReactNode }) {
       return (
              <ThemeProvider>
                     <NextUIProvider>{children}</NextUIProvider>
              </ThemeProvider>
       );
}