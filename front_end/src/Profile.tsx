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



function Information(props: any) {
  return  (
    <Card id="info">
      <Card.Header className="header" as="h3" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
      <Card.Body style={{background: '#FCEEFF'}}>
        <Row>
          <Col md={6}><Card.Text><strong>Username:</strong> {props.username}</Card.Text></Col>
          <Col md={6}><Card.Text><strong>Email:</strong> {props.email}</Card.Text></Col>
        </Row>
        <Row>
          <Col md={6}><Card.Text><strong>Name:</strong> {props.firstname} {props.lastname}</Card.Text></Col>
          <Col md={6}><Card.Text><strong>Phone:</strong> {props.phone}</Card.Text></Col>
        </Row>
        <Row>
          <Col md={6}><Card.Text><strong>Roles:</strong> {props.roles}</Card.Text></Col>
          <Col md={6}><Card.Text><strong>UserID:</strong> {props._id}</Card.Text></Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

function UserPosted(props: any) {
  const [likes, setLikes] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const remove = () => {
    setDeleted(true);
    axios.delete(`http://127.0.0.1:5000/post/${props._id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
  }

  const like = () => {
    if(liked) {
      setLiked(false)
      setLikes(likes - 1)
      axios.post(`http://127.0.0.1:5000/dislike`, {
      post_id: props._id}, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    }
    else {
      setLiked(true)
      setLikes(likes + 1)
      axios.post(`http://127.0.0.1:5000/like`, {
      post_id: props._id}, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
    }
  }

  return (
    <Card border="light" className="text-center" id="card" style={{visibility: deleted ? "hidden" : "visible"}}>
      <Card.Header style={{background: '#C6F5FF'}} as="h3"> {props.title}</Card.Header>
      <Card.Body style={{background: '#E3FAFF'}}>
        <Row>
          <Col>
            <Card.Text><strong>Author: </strong> {props.author}</Card.Text>
            <input type="text" id="post_id" value={props._id} hidden readOnly></input>
          </Col>
          <Col>
            <Card.Text><strong>Date Posted: </strong>{props.date_posted}</Card.Text>
          </Col>
        </Row>
        <Row>
          <Col><Card.Text className="posts">{props.content}</Card.Text></Col>
        </Row>
      </Card.Body>
      <Card.Footer id="card-footer">
        <Row>
          <Col md={1} xs={2}>
            <Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>{' '}
          </Col>
          <Col md={1} xs={2}>
            {props.author === localStorage.getItem('username') ? 
              <Button id="button" variant="outline-primary" onClick={() => remove()}>Delete</Button> 
            : '' }
          </Col>  
        </Row>
      </Card.Footer>
    </Card>
  )
}

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
        console.log(res.data)
        // setPostLoading(true);
      }
  })
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
      {info.map(info => (
        <Information key={info._id} firstname={info.firstname} lastname={info.lastname} username={info.username} email={info.email} _id={info._id} phone={info.phone} roles={info.roles} />
      ))}
      <Row>
        <Col md={6}>
          <h1 className="header">Your Posts</h1>
          {/* postLoading === false ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : */ (empty === false && posts.map(post => (
              <FadeIn>
                <UserPosted key={post._id} author={post.author} _id={post._id} title={post.title} date_posted={post.date_posted} content={post.content}/>
              </FadeIn> 
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
                    {/* {<Button id="heart" onClick={like(post._id, post.likes)}><FaHeart/> {post.likes}</Button>} */}
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