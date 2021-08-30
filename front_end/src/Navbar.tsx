import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href ='/';
}


const NavBar = (props:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/Home">Social Media</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="justify-content-center" navbar>
          <NavItem>
            <NavLink href="/Home">Home</NavLink>
          </NavItem>
          <NavItem className="right">
            {!localStorage.getItem('token') && <NavLink href="/Login">Login</NavLink>}
          </NavItem>
          <NavItem>
            {!localStorage.getItem('token') && <NavLink href="/Register">Register</NavLink> }
          </NavItem>
            {localStorage.getItem('token') &&
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {localStorage.getItem('username')}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={logout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> }
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default NavBar;