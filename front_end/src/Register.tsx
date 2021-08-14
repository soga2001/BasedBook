import React from "react";

function Register() {
    return (
      <form className="form">
        <div>
          <label>First Name: </label>
          <input type="text" placeholder="John" required></input>
          <label>Last Name: </label>
          <input type="text" placeholder="John" required></input>
        </div>
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
    );
  }

export default Register