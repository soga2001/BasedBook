import React, { useState } from 'react';
import {
  Collapse,
  Navbar, NavbarBrand, Nav, NavItem, NavLink, Container, NavDropdown
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href ='/';
}


const NavBar = (props:any) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Container>
  <Navbar.Brand href="/Home">Social Media</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="/Home">Home</Nav.Link>
      {localStorage.getItem('token') && <Nav.Link href="/Post">Post</Nav.Link>}
    </Nav>
    <Nav>
    {!localStorage.getItem('token') && <Nav.Link href="/Login">Login</Nav.Link>}
    {!localStorage.getItem('token') && <Nav.Link href="/Register">Register</Nav.Link>}
    {localStorage.getItem('token') &&
      <NavDropdown title={localStorage.getItem('username')} id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
        </NavDropdown>}
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
  );
}

export default NavBar;