import "./App.less";
import Home from "./pages/Home";
import { createHashRouter, RouterProvider } from "react-router-dom";
import A from "./pages/A";
import Layout from "./pages/layout";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/A",
    element: <A />,
  },
  {
    path: "/Layout",
    element: <Layout />,
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
