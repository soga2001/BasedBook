import React, { Component } from "react";
import './App.css';
import { NavLink, BrowserRouter as Router, Route} from "react-router-dom"
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Post from "./Post";
import Token from "./Token";


class Navbar extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <nav className="topnav">
            <div>
              <ul>
                <div className="left" >
                  <li><NavLink to='/Home' activeStyle={{background: 'white', color: 'black'}}>Home</NavLink></li>
                  <li><NavLink to='/Post' activeStyle={{background: 'white', color: 'black'}}>Post</NavLink></li>
                  <li><NavLink to='/Token' activeStyle={{background:'white', color: 'black'}}>Token</NavLink></li>
                  {/* <li><Link to='/Discover'>Discover</Link></li> */}
                </div>
                <div className="right">
                  <li><NavLink to='/Login' activeStyle={{background: 'white', color: 'black'}}>Login</NavLink></li>
                  <li><NavLink to='/Register' activeStyle={{background: 'white', color: 'black'}}>Register</NavLink></li>
                </div>
              </ul>
            </div>
          </nav>
          <Route path="/" exact component={Home}/>
          <Route path="/Home" exact component={Home}/>
          <Route path="/Post" exact component ={Post}/>
          <Route path="/Token" exact component={Token}/>
          <Route path="/Login" exact component={Login}/>
          <Route path="/Register" exact component={Register}/>
        </Router>
      </div>
    );
  }
}
export default Navbar;