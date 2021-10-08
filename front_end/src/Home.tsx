import React, { useState, useEffect} from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
// import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";
import ReactLoading from 'react-loading';
import FadeIn from 'react-fade-in';
import { FaHeart} from "react-icons/fa";
import Alert from 'react-bootstrap/Alert'

function Home() {
  const [posts, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const post = async () => {
    const fetchPost = await fetch("http://127.0.0.1:5000/post");
    const jsonData = await fetchPost.json();
    setData(jsonData.posts);
    setLoading(false);
  }

  useEffect(() => {
    post();
  }, [])

  return (
    <Container>
      <h1 className="header">Home Page</h1>
      <FadeIn>
        {loading === true ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : posts.map(post => (
          <Postview key={post._id} _id={post._id} title={post.title} author={post.author} date_posted={post.date_posted} 
          content={post.content}/>
        ))}
      </FadeIn>
    </Container>
  )
}

function Postview(props: any) {
  const [likes, setLikes] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [liked, setLiked] = useState<Boolean>();
  const [token] = useState(localStorage.getItem("token"))

  const remove = () => {
    setDeleted(true);
    axios.delete(`http://127.0.0.1:5000/post/${props._id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
  }

  const like = () => {
    if(liked && token) {
      console.log(liked, "token")
      setLiked(false)
      setLikes(likes - 1)
      axios.post(`http://127.0.0.1:5000/dislike`, {
      post_id: props._id}, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    }
    else if (!liked && token) {
      console.log("token")
      setLiked(true)
      setLikes(likes + 1)
      axios.post(`http://127.0.0.1:5000/like`, {
      post_id: props._id}, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
    }
    else {
      setError(true)
      setMessage("You are not logged in.")
    }
  }

  const userLiked = () => {
    axios.post("http://127.0.01:5000/liked", {
      postId: props._id,
      userId: localStorage.getItem("username")
    })
      .then((res) => {
        if(res.data.liked) {
          console.log("true")
          setLiked(true)
        }
        else {
          console.log('false')
          setLiked(false)
        }
        setLikes(res.data.likes)
      })
  }

  useEffect(() => {
    userLiked();
  },[])

  return (
    <div>
      {deleted ? '' : <Card key={props._id} border="light" className="text-center" id="card" style={{visibility: deleted ? "hidden" : "visible"}}>
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
            {<Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>}{' '}
          </Col>
            {error && <Alert variant="danger" className="message">{message}</Alert>}
          <Col md={1} xs={2}>
            {props.author === localStorage.getItem('username') ? 
              <Button id="button" variant="outline-primary" onClick={() => remove()}>Delete</Button> 
            : '' }
          </Col>
        </Row>
      </Card.Footer>
    </Card>}
    </div>
    
  )
}

export default Home;