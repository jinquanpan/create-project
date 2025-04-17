import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import "./index.less";
import {cancelAsyncParam} from '@/api/home';

// new URL(`@/assets/react.svg`, import.meta.url).href

function Home({dispatch}) {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  const handerLogin = () => {
    dispatch({ type: 'user/logout' });
  }  

  const handerAsync = async (num) => {
    let a = await cancelAsyncParam(num);
    console.log('a+++++++++',a);
  }

  return (
    <div >
      Home <div className="img"></div>
      <img src="/assets/react.svg" alt="" onClick={() => navigate("/A")} />
      <Button
        onClick={handerAsync}
      >
        请求
      </Button>
      <Button
        onClick={()=>handerAsync(2)}
      >
        请求1
      </Button>
      <Button
        onClick={handerLogin}
      >
        退出登陆萨达sasdas
      </Button>
    </div>
  );
}

export default Home;
