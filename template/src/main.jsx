import React from "react";
import Router from "./router.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import Redux from '@/utils/redux'
import { PersistGate } from "redux-persist/integration/react";



function App() {
  return (
    <Provider store={Redux.store}>
      <PersistGate loading={null} persistor={Redux.persistor}>
        <Router />
      </PersistGate>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
