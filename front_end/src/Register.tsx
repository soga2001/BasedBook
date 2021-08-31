import React, { Component } from "react";
import axios from "axios";
import './style.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

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
        else if(res.data) {
          this.setState({err: ''})
          this.setState({registered: 'You have been registered. Redirecting to the login page....'})
          setTimeout(()=>window.location.href = '/Login', 800)
        }
    });
  }
        
    render() {
        return (
            <Container style={{padding: '1%'}}>
              <Card style={{ width: '50rem', margin: 'auto' }} className="text-center">
                <Card.Header as='h3'>Register</Card.Header>
                <Card.Body>
                  <form onSubmit={this.register}>
                    <Row>
                      <Col><label htmlFor="email">Email:</label></Col>
                      <Col><input type="email" className="" id="email" placeholder="user123@example.com" required/></Col>
                    </Row>
                    <Row>
                      <Col><label htmlFor="username">Username:</label></Col>
                      <Col><input type="username" className="" id="username" placeholder="user123" required/></Col>
                    </Row>
                    <Row>
                      <Col><label htmlFor="password">Password:</label></Col>
                      <Col><input type="password" className="" id="password" required /></Col>
                    </Row>
                      <Button type="submit">Register</Button>
                  </form>
                  {this.state.err ? <Alert variant="danger"> {this.state.err} </Alert> : 
                  this.state.registered &&  <Alert variant="danger">
                  {this.state.registered}
                  </Alert>}
                </Card.Body>
              </Card>
            </Container>
        );
    }
}

export default Register;