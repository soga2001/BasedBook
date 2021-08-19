import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {err: "", registered: ""};

  register = (e: any) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/register", {
      email: (document.getElementById("email") as HTMLInputElement).value,
      username: (document.getElementById("username") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value
    })
      .then((res) => {
        if (res.data.error) {
          this.setState({registered: ''})
          this.setState({err: res.data.error})
        }
        else if(res.data.success) {
          this.setState({err: ''})
          this.setState({registered: res.data.success})
        }
    });
  }
        
    render() {
        return (
            <div className="App">
              <header className="header">Register</header>
              {this.state.err ? <h3 className="message">{this.state.err}</h3> : <h3 className="message">{this.state.registered}</h3>} 
              <form onSubmit={this.register}>
                <p>
                  <label htmlFor="email">Email:</label>
                  <input type="email" className="" id="email" required/>
                </p>
                <p>
                  <label htmlFor="username">Username:</label>
                  <input type="username" className="" id="username" required/>
                </p>
                <p>
                  <label htmlFor="password">Password:</label>
                  <input type="password" className="" id="password" required />
                </p>
                  <button type="submit" className="">Register</button>
              </form>
            </div>
        );
    }
}

export default Register;