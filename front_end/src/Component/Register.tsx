import React, { Component } from "react";
import axios from "axios";
import {Button, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import ReactLoading from 'react-loading';

class Register extends Component {
  state = {err: "", registered: "", loading: false};

  register = async (e: any) => {
    e.preventDefault();
    this.setState({loading: true})
    var email = (document.getElementById("email") as HTMLInputElement).value;
    // if(email.split('@')[0].length < 4) {
    //   this.setState({loading: false})
    //   this.setState({err: "Email is too short. Please try again."});
    // }
    // else {
      axios.post("/register", {
        firstname: (document.getElementById("firstname") as HTMLInputElement).value,
        lastname: (document.getElementById("lastname") as HTMLInputElement).value,
        phone: (document.getElementById("phone") as HTMLInputElement).value,
        email: email,
        username: (document.getElementById("username") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement).value
      })
      .then((res) => {
        if (res.data.error) {
          this.setState({loading: false})
          this.setState({registered: ''})
          this.setState({err: res.data.error})
        }
        else if(res.data) {
          this.setState({loading: false})
          this.setState({err: ''})
          this.setState({registered: 'Success'})
          setTimeout(()=>window.location.href = '/Login', 800)
        }
      });
    // }
}
        
    render() {
        return (
          <Container className="body">
          <div className="user">
            <h1 className="text-center">Register</h1>
            <hr></hr>
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
                    <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" id="phone" placeholder="111-111-1111" required/>
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
              {this.state.loading ? <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/> : <Button type="submit" variant="outline-primary" className='button'>Register</Button>}
            </form>
            {this.state.err ? <Alert variant="danger"> {this.state.err} </Alert> : 
            this.state.registered &&  <Alert variant="info">
            {this.state.registered}
            </Alert>}
          </div>
        </Container> 
        );
    }
}

export default Register;