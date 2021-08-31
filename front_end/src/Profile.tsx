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

class Profile extends Component {
  state: { err: string; data: Post[], username: string, message: string, posted_content: boolean } = { err: "", data: [], username: '', message: '', posted_content: false };

  constructor(props: any) {
    super(props);
    this.setData();
  }

  setData() {
    axios.get("http://127.0.0.1:5000/user_post", {headers: {
        'Authorization': 'Bearer' + localStorage.getItem('token')
    }}).then((res) => {
        if(res.data.message) {
            this.setState({posted_content: false})
            this.setState({message: res.data.message})
        }
        else {
            this.setState({posted_content: true})
            this.setState({data: res.data });
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
        // setTimeout(() => window.location.href = '/Profile', 800)
      }
    })
  }



  renderData(post: Post) {
      try {
        return (
            <Container>
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
            </Container>
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
      <div className="">
        <header className="header">Profile</header>
        <div>
          {this.state.posted_content === true ? this.state.data.map((post) => (
            <div>
              {this.renderData(post)}
            </div>
          )) : this.state.message}
        </div>
      </div>
    );
  }
}


export default Profile;