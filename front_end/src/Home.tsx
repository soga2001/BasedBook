import React, { Component } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'
import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";

interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
  likes: number;
}

class Home extends Component {
  state: { err: string; data: Post[], username: string, message: string} = { err: "", data: [], username: '', message: ''};

  constructor(props: any) {
    super(props);
    this.setData();
  }

  setData() {
    axios.get("http://127.0.0.1:5000/post").then((res) => {
      this.setState({ data: res.data });
    });
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
                this.setState({message: res.data.success})
                setTimeout(() => window.location.href = '/Home', 800)
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
          post.likes++;
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
        this.setState({message: <Alert variant="danger" style={{fontSize: "15px", marginTop: '10%'}}>You are not logged in.</Alert>})
      })
    }
  }


  renderData(post: Post) {
      return (
        <Container>
          <Card border="light" className="text-center" id="card-header">
            <Card.Header style={{background: '#C6F5FF'}} as="h3"> {post.title}</Card.Header>
            <Card.Body style={{background: '#E3FAFF'}}>
              <Row>
                <Col>
                    <Card.Text><strong key={post.author}>Author: </strong> {post.author}</Card.Text>
                    <input type="text" id="post_id" key={post._id} value={post._id} hidden readOnly></input>
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
                      {this.state.message}
                    </Col>
                    <Col xs={1} md={1} id="delete">
                      {post.author === localStorage.getItem('username') ? 
                        <Button key='delete' variant="outline-primary" onClick={this.delete(post._id)}>Delete</Button> 
                      : '' }
                    </Col>
                  </Row>

            </Card.Footer>
          </Card>
        </Container>
        
      )
  }

  render() {
    return (
      <div className="app">
        <h1 className="header">Home Page</h1>
          {this.state.data.map((post) => (
            <div style={{margin: '1%'}}>
              {/* <Post post={post}>

              </Post> */}
              {this.renderData(post)}
            </div>
          ))}
      </div>
    );
  }
}


export default Home;