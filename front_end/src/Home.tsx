import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
// import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";

function Home() {
  const [posts, setData] = useState<any[]>([])

  const post = async () => {
    const fetchPost = await fetch("http://127.0.0.1:5000/post");
    const jsonData = await fetchPost.json();
    setData(jsonData);
  }

  const remove = (postId: String) => {
    return (e: any) => (
      axios.delete(`http://127.0.0.1:5000/post/${postId}`, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      }).then((res)=> {
        if(res.data) {
           post()
        }
    }) 
    )
  }

  const like = (postID: any, postLikes: any) => {
    return (e: any) => {
      axios.patch(`http://127.0.0.1:5000/like`, {
        post_id: postID,
        likes: postLikes
      }, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      } )
      .then((res) => {
        post();
      })
    }
  }

  useEffect(() => {
    post();
  }, []);

  return (
    <Container>
      <h1 className="header">Home Page</h1>
        {posts.map(post => (
          <Card key={post._id} border="light" className="text-center" id="card">
            <Card.Header style={{background: '#C6F5FF'}} as="h3"> {post.title}</Card.Header>
            <Card.Body style={{background: '#E3FAFF'}}>
              <Row>
                <Col>
                    <Card.Text><strong>Author: </strong> {post.author}</Card.Text>
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
                <Col md={1} xs={2}>
                  {<Button id="heart" onClick={like(post._id, post.likes)}><FiHeart/> {post.likes}</Button>}
                </Col>
                <Col md={1} xs={2}>
                  {post.author === localStorage.getItem('username') ? 
                    <Button id="button" variant="outline-primary" onClick={remove(post._id)}>Delete</Button> 
                  : '' }
                </Col>  
              </Row>
            </Card.Footer>
          </Card>
        ))}
    </Container>
  )
}

export default Home;