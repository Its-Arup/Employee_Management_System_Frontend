import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes";

function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;