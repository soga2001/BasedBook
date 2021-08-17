import React, { Component } from "react";
import axios from "axios"

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
        this.setState({logged_in: ''})
        this.setState({err: res.data.error})
      }
      else if(res.data.success) {
        this.setState({err: ''})
        this.setState({logged_in: res.data.success})
      }
    });
  }
  render() {
    return (
      <div className="App">
        <header className="header">Login</header>
        {this.state.err ? <h3 className="message">{this.state.err}</h3> : <h3 className="message">{this.state.logged_in}</h3>} 
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