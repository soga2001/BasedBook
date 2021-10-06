import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import {FaHeart} from "react-icons/fa"
import {FiHeart} from "react-icons/fi";
import ReactLoading from 'react-loading';
import FadeIn from 'react-fade-in';


function Profile() {

  // User Info //
  const [info, setInfo] = useState<any[]>([]);
  // const [infoLoading, setInfoLoading] = useState(false);

  // User Posted posts //
  const [posts, setPosted] = useState<any[]>([]);
  const [postMessage, setMessage] = useState('');
  const [empty, setEmpty] = useState(false);
  // const [postLoading, setPostLoading] = useState(false);

  // User Liked posts //
  const [likedPost, setLiked] = useState<any[]>([]);
  const [likedMessage, setLikedMessage] = useState('');
  const [likedEmpty, setLikedEmpty] = useState(false);
  // const [likedLoading, setLikedLoading] = useState(false);

  

  const information = async () => {
    const fetchInfo = await fetch("http://127.0.0.1:5000/user",{
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    const data = await fetchInfo.json();
    setInfo(data);
    // await data && setInfoLoading(true);
  };

  const userPosted = async () => {
    const fetchPost = await axios.get("http://127.0.0.1:5000/user_post", {headers: {
      'Authorization': 'Bearer' + localStorage.getItem('token')
      }}).then((res) => {
      if(res.data.message) {
        setMessage(res.data.message)
        setEmpty(true);
      }
      else {
        setEmpty(false);
        setPosted(res.data);
        // setPostLoading(true);
      }
  })
  }

  const remove = (postId: String) => {
    const items = posts.filter(item => item._id !== postId);
    setPosted(items);
    return (e: any) => (
      axios.delete(`http://127.0.0.1:5000/post/${postId}`, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      }).then((res)=> {
        if(res.data.message) {
          setMessage(res.data.message)
          setEmpty(true)
          // setPosted([])
        }
        else {
          setEmpty(false)
          userPosted()
          liked()
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
        userPosted()
        liked()
      })
    }
  }

  const liked = async () => {
    const post = axios.get("http://127.0.0.1:5000/liked", {
      headers: {
        'Authorization': 'Bearer' + localStorage.getItem('token')
    }}).then((res) => {
      if(res.data.message) {
        setLikedMessage("You have liked no posts.")
        setLikedEmpty(true)
        setLiked([]);
      }
      else {
        // this.setState({liked: res.data});
        // this.setState({liked_content: true})
        setLikedEmpty(false)
        setLiked(res.data)
        // setLikedLoading(true);
      }
    })
  }


  useEffect(() => {
    information();
    userPosted();
    liked();
  }, [])

  return (
    <Container>
      <h1 className="header">Profile</h1>
      {/* infoLoading === false ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : */ info.map(info => (
        <Card id="info" key={info.username}>
          <Card.Header className="header" as="h3" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
          <Card.Body style={{background: '#FCEEFF'}}>
            <Row>
              <Col md={6}><Card.Text><strong>Username:</strong> {info.username}</Card.Text></Col>
              <Col md={6}><Card.Text><strong>Email:</strong> {info.email}</Card.Text></Col>
            </Row>
            <Row>
              <Col md={6}><Card.Text><strong>Name:</strong> {info.firstname} {info.lastname}</Card.Text></Col>
              <Col md={6}><Card.Text><strong>Phone:</strong> {info.phone}</Card.Text></Col>
            </Row>
            <Row>
              <Col md={6}><Card.Text><strong>Roles:</strong> {info.roles}</Card.Text></Col>
              <Col md={6}><Card.Text><strong>UserID:</strong> {info._id}</Card.Text></Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Row>
        <Col md={6}>
          <h1 className="header">Your Posts</h1>
          {/* postLoading === false ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : */ (empty === false && posts.map(post => (
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
            ))) || <Alert id="message">{postMessage}</Alert>}
          </Col>
          <Col>
          <h1 className="header">Liked Post</h1>
          {/* likedLoading === false ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : */ (likedEmpty === false && likedPost.map(post => (
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
                    {<Button id="heart" onClick={like(post._id, post.likes)}><FaHeart/> {post.likes}</Button>}
                  </Col>
                </Row>
          </Card.Footer>
        </Card>
          ))) || <Alert id="message">{likedMessage}</Alert>}
          </Col>
        </Row>
    </Container>
  )
}

export default Profile;