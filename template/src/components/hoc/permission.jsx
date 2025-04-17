import { useEffect } from "react";

const LoginPage = '/login'


/**
 * This component is a wrapper for the children, and it's used to 
 * manage the permission for the children.
 * @param {PermissionProps} props 
 * @returns {React.ReactElement} 
 */
function Permission(props) {

  const token = props.useSelector((state) => state.user.token);


  useEffect(() => {
    
    let targetPath = null;

    const pathname = props.location.pathname;
    
    // 访问跟路径 根据登录状态重定向
    if (pathname === "/") {
      targetPath = token ? props.index || "/" : LoginPage;
    }

    // 如果登录跳转首页
    if (location.pathname === LoginPage && token) {
      targetPath = props.index || "/";
    }

    // 如果登录失效跳转登录
    if (!token && location.pathname !== LoginPage) {
      targetPath = LoginPage;
    }

    if (targetPath && targetPath !== location.pathname) {
      props.navigate(targetPath);
    }
  }, [token, location.pathname]);

  
  return null
}

export default Permission
