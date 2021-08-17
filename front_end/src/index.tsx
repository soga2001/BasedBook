import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from './Navbar';
import App from './App';
import Register from './Register';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


ReactDOM.render(
  <React.Fragment>
    <Navbar />
    <Router>
        <Switch>
          <Route path="/" exact component={App}/>
          <Route path="/Login" exact component={Login}/>
          <Route path="/Register" exact component={Register}/>
        </Switch>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();