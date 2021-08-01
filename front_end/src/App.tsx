import React, { Component, useState } from "react";
import "./App.css";
import axios from "axios";
import { useAsync } from "react-async";

interface userInfo {
  firstName: String;
  middleName?: String;
  lastName: String;
}

function login({firstName, middleName = "N/A", lastName}:userInfo)
{

}
function App() {
  const url = "http://127.0.0.1:5000/users";


  async function get_user() {
    axios
      .get("http://127.0.0.1:5000/users")
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <Form />
    </div>
  );
}

function Form() {
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

export default App;
