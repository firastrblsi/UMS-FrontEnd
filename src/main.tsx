import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/store";
import { AppRouter } from "./app/router/AppRouter";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import { system } from "./shared/Theme";
import "./i18n";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ChakraProvider value={system}>
        <AppRouter />
        <Toaster />
      </ChakraProvider>
    </ReduxProvider>
  </StrictMode>,
);
