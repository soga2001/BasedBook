import React, { Component } from "react";
import './App.css';
import { NavLink, BrowserRouter as Router, Link, Route} from "react-router-dom"
import Home from './Home';
import Register from './Register';
import Login from './Login';


class Navbar extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <nav className="topnav">
            <div>
              <ul>
                <div className="left" >
                  <li><NavLink to='/Home' activeStyle={{background: 'red'}}>Home</NavLink></li>
                  {/* <li><Link to='/Discover'>Discover</Link></li> */}
                </div>
                <div className="right">
                  <li><NavLink to='/Login' activeStyle={{background: 'red'}}>Login</NavLink></li>
                  <li><NavLink to='/Register' activeStyle={{background: 'red'}}>Register</NavLink></li>
                </div>
              </ul>
            </div>
          </nav>
          <Route path="/" exact component={Home}/>
          <Route path="/Home" exact component={Home}/>
          <Route path="/Login" exact component={Login}/>
          <Route path="/Register" exact component={Register}/>
        </Router>
      </div>
    );
  }
}

export default Navbar;