import React, { Component } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';

interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
}

class Home extends Component {
  state: { err: string; data: Post[], username: string, message: string } = { err: "", data: [], username: '', message: '' };

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

  
  delete = (e: any) => {
    const post_id = {post_id: (document.getElementById("post_id") as HTMLInputElement).value
    }
    console.log(post_id.post_id)
    axios.delete(`http://127.0.0.1:5000/post/${post_id.post_id}`, {
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



  renderData(post: Post) {
      return (
        <Card style={{margin: 'auto', width: '60rem'}} className="text-center">
          <Card.Header as="h3"> {post.title}</Card.Header>
          <Card.Body>
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
              <Col xs={14} md={10}><Card.Text className="posts">{post.content}</Card.Text></Col>
              <Col xs={1} md={2}>{post.author === localStorage.getItem('username') ? <Button key='delete' variant="secondary" onClick={this.delete}>Delete</Button> : '' }</Col>
            </Row>
          </Card.Body>
        </Card>
      )
  }

  render() {
    return (
      <div className="">
        <header className="header">Home Page</header>
          {this.state.data.map((post) => (
            <div style={{margin: '1%'}}>
              {this.renderData(post)}
            </div>
          ))}
      </div>
    );
  }
}


export default Home;