import React, { Component } from "react";
import axios from "axios"
import './style.css'
import Alert from 'react-bootstrap/Alert'
import {Button, Card, Row, Col, Container} from 'react-bootstrap';


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
      <Container style={{padding: '1%'}}>
        <Card style={{ width: '70%', margin: 'auto' }} className="text-center">
          <Card.Header as='h3'>Login</Card.Header>
          <Card.Body style={{padding: '3%'}}>
            <form onSubmit={this.login}>
              <Row>
                <Col xs={6} md={4}><label>Username: </label></Col>
                <Col xs={12} md={8}><input type="text" id="username" placeholder="user123" required></input></Col>
              </Row>
              <Row>
                <Col xs={6} md={4}><label>Password: </label></Col>
                <Col xs={12} md={8}><input type="password" id="password" required></input></Col>
              </Row>
                <Button type="submit">Login</Button>
            </form>
            {this.state.err ? 
              <Alert variant="danger"> {this.state.err} </Alert> :
              this.state.logged_in &&  <Alert variant="danger">
              {this.state.logged_in}
              </Alert> }
          </Card.Body>
        </Card>
      </Container>
        
      
    );
  }
}

  export default Login;