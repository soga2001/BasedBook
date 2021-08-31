import React, {Component} from 'react';
import {
  Navbar, 
  Container, 
  Nav, 
  NavDropdown
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href ='/Home';
}


class NavBar extends Component {
  state = {activeKey: ''}
  getInitialState() {
    return {activeKey: 1};
  }
  
  handleSelect(selectedKey: any) {
    this.setState({activeKey: selectedKey});
  }
  render() {
    return (
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/Home"><img id="logo"
            alt="Logo"
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}Social Media</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" variant="pills">
            <Nav.Link href="/Home">Home</Nav.Link>
            {localStorage.getItem('token') && <Nav.Link  href="/Post">Post</Nav.Link>}
          </Nav>
          <Nav>
            {!localStorage.getItem('token') && <Nav.Link eventKey="/Login" href="/Login">Login</Nav.Link>}
            {!localStorage.getItem('token') && <Nav.Link eventKey="/Register" href="/Register">Register</Nav.Link>}
            {localStorage.getItem('token') &&
              <NavDropdown title={localStorage.getItem('username')} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  
}

export default NavBar;