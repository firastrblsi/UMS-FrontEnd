import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/store";
import { AppRouter } from "./app/router/AppRouter";
import { Provider } from "@/components/ui/provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <Provider>
        <AppRouter />
      </Provider>
    </ReduxProvider>
  </StrictMode>,
);
