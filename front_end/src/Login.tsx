import React from "react";

function Login() {
    return (
      <div className="Login">
        <form>
          <div>
            <label>Email: </label>
            <input type="email  " required></input>
          </div>
          <div>
            <label>Username: </label>
            <input type="text" required></input>
          </div>
          <div>
            <label>Password: </label>
            <input type="password" required></input>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      
    );
  }

  export default Login