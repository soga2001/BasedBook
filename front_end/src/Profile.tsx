import React, { Component } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
// import {Redirect} from './Token';

interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  roles: string;
}
  

class Profile extends Component {
  state: { 
    err: string; data: Post[], info: User[], username: string, message: string, posted_content: boolean
  } 
  = { 
    err: "", data: [], info: [], username: '', message: '', posted_content: false
  };

  constructor(props: any) {
    super(props);
    this.setData();
  }

  setData() {
    axios.get("http://127.0.0.1:5000/user_post", {headers: {
        'Authorization': 'Bearer' + localStorage.getItem('token')
    }}).then((res) => {
        if(res.data.message) {
            this.setState({message: res.data.message})
            this.setState({posted_content: false});
        }
        else {
            this.setState({posted_content: true});
            this.setState({data: res.data });
        }
    })
    axios.get("http://127.0.0.1:5000/user", {headers: {
        'Authorization': 'Bearer' + localStorage.getItem('token')
    }}).then((res) => {
        if(res.data) {
          this.setState({info: res.data});
          console.log(this.state.info)
        }
    })
  }

  home = (e: any) => {
    this.setData();
  };
  delete = (e: any) => {
    const post_id = {post_id: (document.getElementById("post_id") as HTMLInputElement).value
    }
    axios.delete(`http://127.0.0.1:5000/post/${post_id.post_id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    .then((res)=> {
      if(res.data.success) {
        this.setState({posted_content: false})
        this.setState({message: res.data.success})
        setTimeout(() => window.location.href = '/Profile', 800)
      }
    })
  }



  renderData(post: Post) {
      try {
        return (
          <Card style={{margin: 'auto', width: '100%'}} className="text-center">
              <Card.Header as="h3" style={{background: '#FFDBEC'}}> {post.title}</Card.Header>
              <Card.Body style={{background: '#FDE7F1'}}>
                  <Row>
                      <Col>
                          <Card.Text><strong>Author: </strong> {post.author}</Card.Text>
                          <Card.Text hidden>{post._id}</Card.Text>
                          <input type="text" id="post_id" value={post._id} hidden readOnly></input>
                      </Col>
                      <Col>
                          <Card.Text><strong>Date Posted: </strong>{post.date_posted}</Card.Text>
                      </Col>
                  </Row>
                  <Row>
                      <Col xs={11} md={11}><Card.Text className="posts">{post.content}</Card.Text></Col>
                      <Col xs={1} md={1}> <Button key='delete' variant="outline-primary" onClick={this.delete} id="delete">Delete</Button></Col>
                  </Row>
              </Card.Body>
          </Card>
        )
      }
      catch {
          return (
              <div>
                  {this.state.err}
              </div>
          )
      }
  }

  renderInfo(user: User) {
    try {
      return (
        <div>{
        <Card  style={{width: '100%'}} id="info">
          <Card.Header className="header" as="h3" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
          <Card.Body style={{background: '#FCEEFF'}}>
            <Row>
              <Col xs={5}><Card.Text><strong>Username:</strong> {user.username}</Card.Text></Col>
              <Col><Card.Text><strong>Email:</strong> {user.email}</Card.Text></Col>
            </Row>
            <Row>
              <Col xs={5}><Card.Text><strong>Name:</strong> {user.firstname} {user.lastname}</Card.Text></Col>
              <Col><Card.Text><strong>Phone:</strong> {user.phone}</Card.Text></Col>
            </Row>
            <Row>
              <Col xs={5}><Card.Text><strong>Roles:</strong> {user.roles}</Card.Text></Col>
              <Col><Card.Text><strong>UserID:</strong> {user._id}</Card.Text></Col>
            </Row>
          </Card.Body>
        </Card>}
          
        </div>
          
      )
    }
    catch {
        return (
            <div>
                {this.state.err}
            </div>
        )
    }
  }

  render() {
    return (
      <div className="app">
        <Container className="container"> 
          <h1 className="header">Profile</h1>
          {localStorage.getItem("token") ? 
          <Row>
            <Col xs={5}>
              <p className="header"></p>
            </Col>
            <Col xs={7}>
            <div >
                <h3 className="header">Your Posts</h3>
              </div>
            </Col>
            <Col xs={5}>
              <div>
              {this.state.info.map((user) => (
                <div style={{margin: '1%'}}>
                  {this.renderInfo(user)}
                </div>
              ))}
            </div>
            </Col>
            <Col xs={7}>
              <div >
                {this.state.posted_content === true ? this.state.data.map((post) => (
                  <div style={{margin: '1%'}}>
                    {this.renderData(post)}
                  </div>
                )) : ( localStorage.getItem("token") && <Alert className="message">{this.state.message}</Alert>)}
              </div>
            </Col>
          </Row> : window.location.href = '/Home'}
        </Container>
      </div>
      
    );
  }
}


export default Profile;