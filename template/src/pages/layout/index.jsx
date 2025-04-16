import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import WithPage from "@/components/hoc/with-page";
import Permission from "@/components/hoc/permission";

const LayoutRoot = (props) => {
  return (
    <div>
      <h1>Layoutsss</h1>
      <Outlet />
    </div>
  )
}

const Layout = (props) => {
  console.log('LayoutRoot++++++++',props);
  

  return (
    <>
      <Permission index="/home" {...props} />
      {props.location.pathname == '/login' ? <Outlet /> : <LayoutRoot {...props}/>}
    </>
  )
}

export default WithPage(Layout);

