import React, { Component } from "react";
import axios from "axios"

class Login extends Component {
  login = (e: any) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/login", {
      username: (document.getElementById("username") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value
    })
    .then((res) => {
      console.log(res.data)
    });
  }
  render() {
    return (
      <div className="App">
        <form onSubmit={this.login}>
          <div>
            <label>Username: </label>
            <input type="text" id="username" required></input>
          </div>
          <div>
            <label>Password: </label>
            <input type="password" id="password" required></input>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      
    );
  }
}

  export default Login