import React, { Component } from "react";
import axios from "axios";
import '../style.css';
import {Button, Card, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

class Register extends Component {
  state = {err: "", registered: ""};

  register = (e: any) => {
    e.preventDefault();
    axios.post("/register", {
      firstname: (document.getElementById("firstname") as HTMLInputElement).value,
      lastname: (document.getElementById("lastname") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
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
            <Container className="body"> 
              <Card style={{ width: '70%', margin: 'auto'}} >
                <Card.Header as='h3' className="header" style={{ color: 'black'}}>Register</Card.Header>
                <Card.Body>
                  <form onSubmit={this.register}>
                    <Row>
                      <Col>
                        <FloatingLabel  label="First Name" className="mb-3">
                          <Form.Control type="text" id="firstname" placeholder="First Name" required/>
                        </FloatingLabel>
                      </Col>
                      <Col>
                        <FloatingLabel  label="Last Name" className="mb-3">
                          <Form.Control type="text" id="lastname" placeholder="Last Name" required />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FloatingLabel  label="Email" className="mb-3">
                          <Form.Control type="email" id="email" placeholder="name@example.com" required />
                        </FloatingLabel>
                      </Col>
                      <Col>
                        <FloatingLabel  label="Phone: 111-111-1111" className="mb-3">
                          <Form.Control type="tel" id="phone" placeholder="111-111-1111" required/>
                        </FloatingLabel>
                      </Col>
                    </Row>
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
                    <Button type="submit" variant="outline-primary" className='button'>Register</Button>
                  </form>
                  {this.state.err ? <Alert variant="danger"> {this.state.err} </Alert> : 
                  this.state.registered &&  <Alert variant="info">
                  {this.state.registered}
                  </Alert>}
                </Card.Body>
              </Card>
            </Container>
            
        );
    }
}

export default Register;