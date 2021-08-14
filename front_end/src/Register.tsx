import React, { Component } from "react";
import axios from "axios";
import { valueToNode } from "@babel/types";

class Register extends Component {
  register = (e: React.FormEvent) => {
    axios.post("http://localhost:5000/register", {
      email: document.getElementById("email")?.nodeValue,
      username: document.getElementById("username")?.nodeValue,
      password: document.getElementById("password")?.nodeValue

    })
      .then((res) => {
        console.log(res.data);
    });
  }
        
    render() {
        return (
            <div className="App">
              <form onSubmit={this.register}>
                <p>
                  <label htmlFor="email">Email:</label>
                  <input type="email" className="" id="email" />
                </p>
                <p>
                  <label htmlFor="username">Username:</label>
                  <input type="username" className="" />
                </p>
                <p>
                  <label htmlFor="password">Password:</label>
                  <input type="password" className="" id="password"/>
                </p>
                <p>
                  <button type="submit" className="">Register</button>
                </p>
              </form>
            </div>
        );
    }
}

export default Register;