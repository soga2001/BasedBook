import React from "react";

function Login() {
    return (
      <div className="App">
        <div>
          <form>
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
        
      </div>
      
    );
  }

  export default Login