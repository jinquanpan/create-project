import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";

function Home() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();
  let getImage = new URL(`@/src/assets/react.svg`, import.meta.url).href;

  return (
    <div onClick={() => navigate("/A")}>
      Home <div className="img"></div>
      <img src={getImage} alt="" />
    </div>
  );
}

export default Home;
