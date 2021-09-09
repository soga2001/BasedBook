import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavBar from './Navbar';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Post from "./Post";
import Profile from './Profile';
// import Footer from './Footer';
import Setting from './Setting';


ReactDOM.render(
  <React.Fragment>
    <NavBar />
    <Router>
      <Route exact path="/"><Home/></Route>
        <Route exact path="/Home"> <Home /> </Route>
        <Route exact path="/Post"><Post/></Route>
        <Route exact path="/Login"> <Login /> </Route>
        <Route exact path="/Register"> <Register /> </Route>
        <Route exact path="/Profile"><Profile/></Route>
        <Route exact path="/Setting"><Setting /></Route>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();