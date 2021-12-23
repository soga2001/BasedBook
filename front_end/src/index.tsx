import React from 'react';
import ReactDOM from 'react-dom';
import 'axios';

import reportWebVitals from './reportWebVitals';
import './index.css';
import NavBar from './Component/Navbar';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

ReactDOM.render(
  <React.Fragment>
    <NavBar />
  </React.Fragment>,
  document.getElementById('root') 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();