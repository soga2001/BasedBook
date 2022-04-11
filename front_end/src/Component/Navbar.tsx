import { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import {
  Navbar, 
  Container, 
  Nav, 
  Row,
  Col,
  Dropdown,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Check_token} from './Token';
// Icons
import { LogIn, LogOut } from 'react-feather';
import { BsHouseDoor, BsFillGearFill, BsFillPersonLinesFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { FaHeart, FaUserTie} from "react-icons/fa";
import LinearProgress from '@mui/material/LinearProgress';
// Pages
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Post from "./Post";
import Profile from './Profile/Profile';
import Setting from './Setting/Setting';
import Liked from './Liked';
import Logout from './Logout';
import About from './About';
import Share from './Share';

function NavBar() {

  const [loading, setLoading] = useState(true);
  const checkToken = async() => {
    await Check_token();
    setLoading(false);
  }

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <Router>
        {!loading ? <Navbar collapseOnSelect expand="sm" bg="dark" id="navbar" fixed="top">
          <Container>
            <Navbar.Brand id="brand" href="/Home"><img id="logo"
                alt="Logo"
                src="/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />Socialite</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav variant="pills" className="me-auto">
                  <NavLink to='/Home' id="item" activeClassName="active">
                    <Row>
                      <Col xs={3}><BsHouseDoor/></Col>
                      <Col xs={3}>Home</Col>
                    </Row>
                  </NavLink>
                    {localStorage.getItem('token') && <NavLink to='/Post' id="item" activeClassName="active"><Row>
                        <Col xs={3}><FiEdit/></Col>
                        <Col xs={3}>Post</Col>
                      </Row></NavLink>}
              </Nav>
              <Nav variant="pills">
                {!localStorage.getItem('token') && <NavLink to='/Login' id="item" activeClassName="active">Login {<LogIn/>}</NavLink>}
                {!localStorage.getItem('token') && <NavLink to='/Register' id="item" activeClassName="active">Register</NavLink>}
                {localStorage.getItem("token") && 
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="toggle">
                      <FaUserTie/>
                      {"   "}
                      {localStorage.getItem("username") + " "}
                    </Dropdown.Toggle>
                    <Dropdown.Menu id="dropdown">
                      <NavLink to="/Profile" id="link" activeClassName="active">
                        <Row>
                          <Col>Profile</Col> 
                          <Col>{<BsFillPersonLinesFill />}</Col>
                        </Row>
                      </NavLink>
                      <NavLink to="/Setting" id="link" activeClassName="active">
                        <Row>
                          <Col>Setting</Col> 
                          <Col>{<BsFillGearFill />}</Col>
                        </Row>
                      </NavLink>
                      <NavLink to="/Liked" id="link" activeClassName="active">
                        <Row>
                          <Col>Liked</Col>
                          <Col><FaHeart/></Col>
                        </Row>
                      </NavLink>
                      <Dropdown.Divider></Dropdown.Divider>
                      <Dropdown.Item id="drop-item" onClick={Logout}>
                        <Row id="link">
                          <Col>LogOut</Col> 
                          <Col>{<LogOut />}</Col>
                        </Row>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                }
              </Nav>
            </Navbar.Collapse>
            
          </Container>
        </Navbar> : <LinearProgress />}
          <Route exact path="/"><About/></Route>
          <Route exact path="/Home"><Home/> </Route>
          <Route exact path="/Post"><Post/></Route>
          <Route exact path="/Login"><Login/></Route>
          <Route exact path="/Register"><Register/></Route>
          <Route exact path="/Profile"><Profile/></Route>
          <Route exact path="/Liked"><Liked/></Route>
          <Route exact path="/Setting"><Setting/></Route>
          <Route exact path="/Share/:id"><Share /></Route>
      </Router>
  )
}

export default NavBar;