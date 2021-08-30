import React, { Component } from "react";
import './style.css';
import { NavLink, BrowserRouter as Router, Route} from "react-router-dom"
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Post from "./Post";

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href ='/';
}


export default class NavBar extends Component {
  render() {
    return(
      <Router>
        
        <nav className="topnav">
          <div>
            <ul>
            <li className="logo"><NavLink exact to='/' activeClassName="selected" ><img src='logo.png' id='logo' alt="Logo"/></NavLink></li>
              <div className="left" >
                
                <li><NavLink to='/Home' activeClassName="active">Home</NavLink></li>
                <li>{localStorage.getItem('token') && <NavLink to='/Post' activeClassName="active">Post</NavLink>}</li>
              </div>
              <div className="right">
                <li>{!localStorage.getItem('token') && <NavLink to='/Login' activeClassName="active">Login</NavLink>}</li>
                <li> {!localStorage.getItem('token') && <NavLink to='/Register' activeClassName="active">Register</NavLink>}</li>
                <li className="logout" onClick={logout} >{localStorage.getItem('token') && <NavLink to='/' activeClassName='logout'>Logout</NavLink>}</li>
              </div>
            </ul>
          </div>
        </nav>
        <Route path="/" exact component={Home}/>
        <Route path="/Home" exact component={Home}/>
        <Route path="/Post" exact component ={Post}/>
        <Route path="/Login" exact component={Login}/>
        <Route path="/Register" exact component={Register}/>
    </Router>
  )
  }
  

}