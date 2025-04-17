import React, { useState } from 'react';
import { Button } from 'antd';
import { login } from '@/store/user';
import {getAppInfo} from '@/api/home';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const handerLogin = () => {
    setLoading(true);
    
    setTimeout(() => {
      props.dispatch(login(''));
      setLoading(false);
    }, 1000);
  }

  const handerAsync = () => {
    getAppInfo()
  }

  return (
    <div>
      <h1>Login</h1>
      <Button
        loading={loading}
        onClick={handerLogin}
      >
        Login
      </Button>
      <Button
        onClick={handerAsync}
      >
        请求
      </Button>
    </div>
  );
};

export default Login;