import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import "./globals.css";
import "boxicons/css/boxicons.css";
import "@fontsource/epilogue";
import "@fontsource/epilogue/latin-400-italic.css";
import "@fontsource/epilogue/latin-700.css";
import NotFound from "./pages/404";

function App() {
  return (
    <Routes>
      <Route Component={Home} path="/" />
      <Route Component={Home} path="/home" />
      <Route Component={NotFound} path="*" />
    </Routes>
  );
}

export default App;
