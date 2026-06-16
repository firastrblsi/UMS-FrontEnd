import "./App.css";
import { AppProvider } from "./app/providers/AppProvider";
import { AppRouter } from "./app/router/AppRouter";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster />
    </AppProvider>
  );
}

export default App;
