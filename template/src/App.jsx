import "./App.less";
import Home from "./pages/Home";
import A from "./pages/A";
import { Routes, Route, useNavigate } from "react-router-dom";
function App() {
  let navigate = useNavigate();

  return (
    <div className="do-page">
      <div onClick={() => navigate("/A")}>头部111</div>
      <Routes>
        <Route path="/Home" element={<A />} /> {/* 👈 Renders at /app/ */}
        <Route path="/A" element={<Home />} /> {/* 👈 Renders at /app/ */}
      </Routes>
    </div>
  );
}

export default App;
