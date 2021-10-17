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

function Liked() {

    // User Liked posts //
    const [likedPost, setLiked] = useState<any[]>([]);
    const [likedMessage, setLikedMessage] = useState('');
    const [likedEmpty, setLikedEmpty] = useState(false);
    // const [likedLoading, setLikedLoading] = useState(false);

    const liked = async () => {
        axios.get("http://127.0.0.1:5000/liked_posts", {
        headers: {
            'Authorization': 'Bearer' + localStorage.getItem('token')
        }}).then((res) => {
        if(res.data.message) {
            setLikedMessage("You have liked no posts.")
            setLikedEmpty(true)
            setLiked([]);
        }
        else {
            setLikedEmpty(false)
            setLiked(res.data)
            // setLikedLoading(true);
        }
        })
    }

    useEffect(() => {
        liked();
    }, [])

    return (
        <Container>
            <h1 className="header">Liked Post</h1>
            {/* likedLoading === false ? <ReactLoading type={'bubbles'} color={"black"} height={100} width={100} className="loading"/> : */ (likedEmpty === false && likedPost.map(post => (
                <LikedPost title={post.title} author={post.author} _id={post._id} content={post.content} date_posted={post.data_posted} />
            ))) || <Alert id="message">{likedMessage}</Alert>}
        </Container>
    )
}
  
function LikedPost(props: any) {
    const [likes, setLikes] = useState(0);
    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState(true);

    const remove = () => {
        setDeleted(true);
        axios.delete(`http://127.0.0.1:5000/post/${props._id}`, {
            headers:{
            'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
    }

    const like = () => {
        if(liked) {
          console.log(liked, "token")
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
    const userLiked = () => {
        axios.get(`http://127.0.01:5000/liked/${props._id}`, {
          headers:{
            'Authorization': 'Bearer' + localStorage.getItem('token')}
          })
          .then((res) => {
            if(res.data.liked) {
              console.log("true")
              setLiked(true)
            }
            else {
              setLiked(false)
            }
            setLikes(res.data.likes)
          })
      }
      
      useEffect(() => {
          userLiked()
      }, [])

    return (
        <Card style={{margin: 'auto', width: '100%'}} className="text-center">
                <Card.Header as="h3" style={{background: '#FFDBEC'}}> {props.title}</Card.Header>
                <Card.Body style={{background: '#FDE7F1'}}>
                    <Row>
                        <Col>
                            <Card.Text><strong>Author: </strong> {props.author}</Card.Text>
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
                    <Col xs={2} md={2}>
                        <Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>{' '}
                    </Col>
                    </Row>
            </Card.Footer>
            </Card>
    )
}

export default Liked;