import React, { Component } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import {FiHeart} from "react-icons/fi";
// import {Redirect} from './Token';

interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
  likes: number
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

interface Liked {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
  likes: number;
}
  

class Profile extends Component {
  state: { 
    err: string; data: Post[], info: User[], liked: Liked[], username: string, message: string, mess: string, posted_content: boolean, liked_content: boolean
  } 
  = { 
    err: "", data: [], info: [], liked: [], username: '', message: '', mess: '', posted_content: false, liked_content: false
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
    axios.get("http://127.0.0.1:5000/liked", {
      headers: {
        'Authorization': 'Bearer' + localStorage.getItem('token')
    }}).then((res) => {
      if(res.data.message) {
        this.setState({liked_content: false})
        this.setState({mess: res.data.message})
      }
      else {
        this.setState({liked: res.data});
        this.setState({liked_content: true})
      }
    })
  }

  home = (e: any) => {
    this.setData();
  };

  delete = (postId: String) => {
    return (e: any) => {
        axios.delete(`http://127.0.0.1:5000/post/${postId}`, {
            headers:{
            'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        .then((res)=> {
            if(res.data.success) {
                setTimeout(() => window.location.href = '/Profile', 800)
            }
        })
    }
  }

  like = (post: Post) => {
    return (e: any) => {
      axios.patch(`http://127.0.0.1:5000/like`, {
        post_id: post._id,
        likes: post.likes
      }, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      } )
      .then((res) => {
        if(res.data) {
          if(res.data.liked === "liked") {
            post.likes++;
          }
          else if(res.data.disliked === "disliked") {
            post.likes--;
          }
          this.setState({data: this.state.data.map(p => {
            if(p._id === post._id){
              return post;
            }
            return p;
          })})
        }
      })
      .catch((error) => {
        console.log(error)
        alert("You are not logged in.")
      })
    }
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
                <Col md={12}><Card.Text className="posts">{post.content}</Card.Text></Col>
              </Row>
            </Card.Body>
            <Card.Footer id="card-footer">
              <Row>
                <Col xs={2} md={2}>
                  {<Button id="heart" onClick={this.like(post)}><FiHeart/> </Button>}
                  <p id="likes">{post.likes}</p>
                  {this.state.message}
                </Col>
                <Col xs={1} md={1} id="delete">
                  {post.author === localStorage.getItem('username') ? 
                    <Button variant="outline-primary" onClick={this.delete(post._id)}>Delete</Button> 
                  : '' }
                </Col>
              </Row>
            </Card.Footer>
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
        <div>
          <Card  style={{width: '100%'}} id="info">
            <Card.Header className="header" as="h3" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
            <Card.Body style={{background: '#FCEEFF'}}>
              <Row>
                <Col md={6}><Card.Text><strong>Username:</strong> {user.username}</Card.Text></Col>
                <Col md={6}><Card.Text><strong>Email:</strong> {user.email}</Card.Text></Col>
              </Row>
              <Row>
                <Col md={6}><Card.Text><strong>Name:</strong> {user.firstname} {user.lastname}</Card.Text></Col>
                <Col md={6}><Card.Text><strong>Phone:</strong> {user.phone}</Card.Text></Col>
              </Row>
              <Row>
                <Col md={6}><Card.Text><strong>Roles:</strong> {user.roles}</Card.Text></Col>
                <Col md={6}><Card.Text><strong>UserID:</strong> {user._id}</Card.Text></Col>
              </Row>
            </Card.Body>
          </Card>
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

  renderLiked(post: Liked) {
    try {
      return(
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
                      <Col><Card.Text className="posts">{post.content}</Card.Text></Col>
                  </Row>
              </Card.Body>
              <Card.Footer id="card-footer">
                  <Row>
                    <Col xs={2} md={2}>
                      {<Button id="heart" onClick={this.like(post)}><FiHeart/> </Button>}
                      <p id="likes">{post.likes}</p>
                    </Col>
                  </Row>
            </Card.Footer>
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

  render() {
    return (
      <div className="app">
        <Container className="container"> 
          <h1 className="header">Profile</h1>
          {localStorage.getItem("token") ? 
          <Row>
              <div>
              {this.state.info.map((user) => (
                <div id="info">
                  {this.renderInfo(user)}
                </div>
              ))}
            </div>
            <Col md={6} >
              <div>
                <h1 className="header">Your Posts</h1>
                {this.state.posted_content === true ? this.state.data.map((post) => (
                  <div style={{margin: '1%'}}>
                    {this.renderData(post)}
                  </div>
                )) : ( localStorage.getItem("token") && <Alert className="message" style={{marginTop: "1%"}}>{this.state.message}</Alert>)}
              </div>
            </Col>
            <Col md={6}>
              <div >
                <h1 className="header">Liked Post</h1>
                {this.state.liked_content === true ? this.state.liked.map((post) => (
                  <div style={{margin: '1%'}}>
                    {this.renderLiked(post)}
                  </div>
                )): ( localStorage.getItem("token") && <Alert className="message" style={{marginTop: "1%"}}>{this.state.mess}</Alert>)}
              </div>
            </Col>
          </Row> : window.location.href = '/Home'}
        </Container>
      </div>
      
    );
  }
}


export default Profile;