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
    window.location.href ='/Home';
}

export default class Navbar extends Component {

  
  
  render() {
    return (
      <Router>
        <nav className="topnav">
          <div>
            <ul>
              <div className="left" >
                <li><NavLink to='/Home' activeStyle={{background: 'white'}}>Home</NavLink></li>
                <li>{localStorage.getItem('token') && <NavLink to='/Post' activeStyle={{background: 'white'}}>Post</NavLink>}</li>
                {/* <li><Link to='/Discover'>Discover</Link></li> */}
              </div>
              <div className="right">
                <li>{!localStorage.getItem('token') && <NavLink to='/Login' activeStyle={{background: 'white'}}>Login</NavLink>}</li>
                <li> {!localStorage.getItem('token') && <NavLink to='/Register' activeStyle={{background: 'white'}}>Register</NavLink>}</li>
                <li className="logout" onClick={logout} >{localStorage.getItem('token') && <NavLink to='/'>Logout</NavLink>}</li>
                
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
    );
  }
}