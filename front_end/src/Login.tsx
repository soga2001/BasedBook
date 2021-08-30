import React, { Component } from "react";
import axios from "axios"
import './style.css'
import {Container, Jumbotron} from 'reactstrap';

class Login extends Component {
  state = {err: "", logged_in: ""};


  login = (e: any) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/login", {
      username: (document.getElementById("username") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value
    })
    .then((res) => {
      if (res.data.error) {
        this.setState({err: res.data.error})
      }
      else if(res.data) {
        this.setState({err: ''})
        this.setState({login: true})
        this.setState({logged_in: "You have been logged in. Redirecting to home page...."})
        localStorage.setItem("token", res.data.access_token)
        localStorage.setItem("username", res.data.username)
        setTimeout(()=>window.location.href = '/Home', 800)
      }
    });
  }
  render() {
    return (
      <div className="App">
        <header className="header">Login</header> 
        <form onSubmit={this.login}>
          <div>
            <label>Username: </label>
            <input type="text" id="username" required></input>
          </div>
          <div>
            <label>Password: </label>
            <input type="password" id="password" required></input>
          </div>
          <div className="button">
            <button type="submit">Login</button>
          </div>
        </form>
        {this.state.err ? <h3 className="message">{this.state.err}</h3> : <h3 className="message">{this.state.logged_in}</h3>}
      </div>
    );
  }
}

  export default Login;