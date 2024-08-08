import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  return <div onClick={() => navigate("/Home")}>Home</div>;
}

export default Home;
