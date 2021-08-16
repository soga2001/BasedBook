import React, { Component } from "react";
// import FlashMessage from 'react-flash-message';
import axios from "axios";

class Register extends Component {
  state = {err: ""};

  register = (e: any) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/register", {
      email: (document.getElementById("email") as HTMLInputElement).value,
      username: (document.getElementById("username") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value
    })
      .then((res) => {
        console.log(res.data);
    });
  }
        
    render() {
        return (
            <div className="App">
              <header>Register</header>
              <form onSubmit={this.register}>
                <p>
                  <label htmlFor="email">Email:</label>
                  <input type="email" className="" id="email" />
                </p>
                <p>
                  <label htmlFor="username">Username:</label>
                  <input type="username" className="" id="username"/>
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