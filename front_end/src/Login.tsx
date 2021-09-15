import React, { Component } from "react";
import axios from "axios"
import './style.css'
import Alert from 'react-bootstrap/Alert'
import {Button, Card, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';


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
        this.setState({logged_in: "You have been logged in. Redirecting to home page...."})
        localStorage.setItem("token", res.data.access_token)
        localStorage.setItem("username", res.data.username)
        setTimeout(()=>window.location.href = '/Home', 800)
      }
    });
  }
  render() {
    return (
      <div className="app">
        <Container style={{padding: '1%'}}>
          <Card style={{ width: '70%', margin: 'auto' }}>
            <Card.Header as='h3' className="header">Login</Card.Header>
            <Card.Body style={{padding: '3%'}}>
              <form onSubmit={this.login}>
                <Row>
                  <Col>
                    <FloatingLabel label="Username" className="mb-3">
                      <Form.Control type="text" id="username" placeholder="username" required />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel label="Password" className="mb-3">
                      <Form.Control type="password" id="password" placeholder="Password" required />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Button type="submit" variant="outline-primary" className='button'>Login</Button>
                
              </form>
              {this.state.err ? 
                <Alert variant="danger" className="message"> {this.state.err} </Alert> :
                this.state.logged_in &&  <Alert className="message">
                {this.state.logged_in}
                </Alert> }
            </Card.Body>
          </Card>
        </Container>
      </div> 
      
      
    );
  }
}

  export default Login;