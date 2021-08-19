import React from "react";
import './App.css';
import { NavLink, Router} from "react-router-dom"


function Navbar() {
  return (
    <div className="App">
        <nav className="topnav">
          <div>
            <ul>
              <div className="left" >
                <li><a href="/Home">Home</a></li>
                <li><a href="/Discover">Discover</a></li>
              </div>
              <div className="right">
                <li><a href="/Login">Login</a></li>
                <li><a href="/Register">Register</a></li>
              </div>
            </ul>
          </div>
        </nav>
    </div>
  );
}

export default Navbar;