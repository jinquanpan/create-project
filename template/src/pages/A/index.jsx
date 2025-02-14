import { useState } from "react";
import { useNavigate } from "react-router-dom";

function A() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  return <div onClick={() => navigate("/Layout")}>A12312</div>;
}

export default A;
