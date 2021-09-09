import React, {Component} from 'react';
import {
  Navbar, 
  Container, 
  Nav, 
  NavDropdown,
  Row,
  Col 
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Check_token} from './Token';
import { LogIn, LogOut } from 'react-feather';
import { BsHouseDoor, BsFillGearFill, BsFillPersonLinesFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href ='/Home';
}
window.onload = function() {
  Check_token()
};

class NavBar extends Component {

  render() {
    return (
      <Navbar collapseOnSelect expand="sm" bg="dark" id="navbar">
        <Container className="container">
          <Navbar.Brand id="brand" href="/"><img id="logo"
              alt="Logo"
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}Social Media</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link id="item" href="/Home">
                  <Row>
                    <Col xs={3}> {<BsHouseDoor/>}</Col>
                    <Col xs={3}>Home</Col>
                  </Row>
                </Nav.Link>
                {localStorage.getItem("token") && <Nav.Link id="item" href="/Post">
                    <Row>
                      <Col xs={3}> <FiEdit/ >  </Col>
                      <Col xs={3}> Post </Col>
                    </Row>
                  </Nav.Link>}
            </Nav>
            <Nav variant="pills">
              {!localStorage.getItem("token") && <Nav.Link id="item" href="/Login">Login {<LogIn/>}</Nav.Link>}
              {!localStorage.getItem("token") && <Nav.Link id="item" href="/Register">Register</Nav.Link>}
              {localStorage.getItem("token") && 
                
                  <NavDropdown title={localStorage.getItem("username")}  id="item" menuVariant="dark">
                        <NavDropdown.Item id="dropdown" href="/Profile">
                          <Row>
                            <Col>Profile</Col> 
                            <Col>{<BsFillPersonLinesFill />}</Col>
                          </Row>
                        </NavDropdown.Item>
                        <NavDropdown.Item id="dropdown" href="/Setting">
                        <Row>
                            <Col>Setting</Col> 
                            <Col>{<BsFillGearFill />}</Col>
                          </Row>
                          </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item id="dropdown" onClick={logout}>
                          <Row>
                            <Col>LogOut</Col> 
                            <Col>{<LogOut />}</Col>
                          </Row>
                          </NavDropdown.Item>
                  </NavDropdown>
                }
            </Nav>
          </Navbar.Collapse>
          
        </Container>
      </Navbar>
      
    )
  }
}
export default NavBar;