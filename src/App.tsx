import "./App.css";
import { AppProvider } from "./app/providers/AppProvider";
import { AppRouter } from "./app/router/AppRouter";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
