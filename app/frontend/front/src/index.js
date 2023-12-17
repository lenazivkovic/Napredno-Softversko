import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App1';
//import reportWebVitals from './reportWebVitals';
import "jquery";
import "popper.js/dist/umd/popper";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Helmet from 'helmet';
import {StoreProvider} from "./Store"
//import NavBar  from './Navbar';


   

ReactDOM.render
(<React.StrictMode>
  <StoreProvider>
  <App />
  </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
