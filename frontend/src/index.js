// import React from "react";
// import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";
// import Login from "./components/Login";
// import Register from "./components/Register";
// render(
//   <BrowserRouter>
//     <App/>
//   </BrowserRouter>,
//   document.querySelector("#root")
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
