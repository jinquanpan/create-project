import {
  createBrowserRouter,
  // createHashRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { lazy, Suspense } from "react";
import WithPage from "@/components/hoc/with-page";

// Helper function to get component name from file path
// 设置路由名为  @/pages/homeindex.jsx  =>  home   多级  @/pages/home/a/index.jsx  =>  home/a
function getComponentName(filePath) {
  const fileName = filePath.split('/').slice(1,-1);
  return fileName.length === 1 ? fileName[0] : fileName.join('/')
}

/**
 * Generate a route element from a path.
 * @param {string} path
 * @returns {React.ReactElement}
 */
function genRouterElement(item) {
  // Lazy load the component and wrap it with WithPage
  const Component = WithPage(item.default);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  )
}

/**
 * Convert paths to routes.
 * @param {__WebpackModuleApi.RequireContext} ctx
 * @returns {RouteObject[]}
 */
function convertPathsToRoutes(ctx) {
  let paths =Object.keys(ctx).map((item)=>item);
  // 过虑pages页面里的components
  paths = paths.filter((el)=>!el.includes('components'));

  // Initialize the root structure
  const root = {
    path: "/",
    children: [],
    // errorElement:<ErrorElement />
  };

  paths.forEach((el)=>{
    let path = el.replace("/src/pages",'.');

    const componentName = getComponentName(path);
    const Element = genRouterElement(ctx[el]);
    
    if (path === './layout/index.jsx') {
      root.element = Element;
    } else {
      const route = {
        path: componentName === 'index' ? "" : componentName,
        element: Element
      };
      root.children.push(route);
    }

  })

  root.children.push({
    path: "*",
    element: <Navigate to="/" replace />
  })


  return [root];
}



const router = createBrowserRouter(  // createHashRouter
  convertPathsToRoutes(import.meta.glob('@/pages/**/*.jsx', { eager: true })),
  {
    future: {
      v7_fetcherPersist: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);



/**
 * Router component.
 * @returns {JSX.Element}
 */
function Router() {
  return (
    <RouterProvider 
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default Router;