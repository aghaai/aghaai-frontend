"use client";
import SideBar from "../components/SideBar";
import { ThemeProvider } from "next-themes";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { Provider as ReduxProvider } from "react-redux";
import { Check, CircleX, Info, TriangleAlert } from "lucide-react";
type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const Provider: React.FC<Props> = ({ children }) => {
  return (
    <React.Fragment>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxProvider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <Toaster
                richColors
                position="top-right"
                icons={{
                  success: <Check className="w-5 h-5" />,
                  error: <CircleX className="w-5 h-5" />,
                  info: <Info className="w-5 h-5" />,
                  warning: <TriangleAlert className="w-5 h-5" />,
                }}
              />
              <SideBar>{children}</SideBar>
            </QueryClientProvider>
          </ThemeProvider>
        </ReduxProvider>
      </PersistGate>
    </React.Fragment>
  );
};

export default Provider;
