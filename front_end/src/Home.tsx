import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
// import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";
import ReactLoading from 'react-loading';
import FadeIn from 'react-fade-in';
import { FaHeart} from "react-icons/fa";
import Alert from 'react-bootstrap/Alert';



function Home() {
  return (
    <Container>
      <h1 className="header">Home Page</h1> {/* For some reason this doesn't appear on the screen but if I remove this, the next home page header doesn't appear on the screen */}
      <h1 className="header">Home Page</h1>
      <FadeIn>
        <PageView />
      </FadeIn>
    </Container>
  )
}



function PageView() {
  const [posts, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState(''); 

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState(10);

  function handleScroll() {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 250) {
      window.removeEventListener('scroll', handleScroll);
      setPage(page + 1);
    }
  }
  
  const post = async () => {
    if(hasMore) {
      setLoading(true);
      const fetchPost = await fetch(`http://127.0.0.1:5000/post?limit=${limit}&page=${page}`);
      const jsonData = await fetchPost.json();
      await jsonData.posts && setData((prev) => {
        return [...new Set([...prev, ...jsonData.posts])]
      });
      // Supposedly the setData() above makes sure there are no duplicate posts in the array, didn't actually work.
      window.addEventListener('scroll', handleScroll)
      if(jsonData.hasMore === false) {
        setHasMore(jsonData.hasMore);
        setMessage("There are no more posts.");
        window.removeEventListener('scroll', handleScroll)
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    post();
  }, [page])

  return (
    <div>
      {posts.map(post => (
        <Postview key={post._id} _id={post._id} title={post.title} author={post.author} date_posted={post.date_posted} 
        content={post.content}/>
      ))}
      <div></div>
      {!loading ? <Alert id="message">{message}</Alert> : <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/>}
    </div>
  )
}

function Postview(props: any) {
  const [likes, setLikes] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [liked, setLiked] = useState<Boolean>();
  const [token] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true);

  const remove = () => {
    setDeleted(true);
    axios.delete(`http://127.0.0.1:5000/post/${props._id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
  }

  const like = () => {
    if(liked && token) {
      setLiked(false)
      setLikes(likes - 1)
      axios.post(`http://127.0.0.1:5000/dislike`, {
      post_id: props._id}, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    }
    else if (!liked && token) {
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
    axios.get(`http://127.0.01:5000/liked/${props._id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
      .then((res) => {
        if(res.data.liked) {
          setLiked(true)
        }
        else {
          setLiked(false)
        }
        setLoading(false)
        setLikes(res.data.likes)
      })
  }

  useEffect(() => {
    userLiked();
  },[])

  return (
    <div>
      <div>
        {
        deleted ? '' : <Card key={props._id} border="light" className="text-center" id="card">
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
      </Card>
      }</div>
    </div>
    
  )
}

export default Home;