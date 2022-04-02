import {useState, useEffect} from 'react';
import axios from 'axios';
import { FaHeart} from "react-icons/fa";
import Alert from 'react-bootstrap/Alert';
import {FiHeart} from "react-icons/fi";
import {Button, Card, Row, Col} from 'react-bootstrap';
import moment from 'moment';

function Postview(props: any) {
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
        <div>
            {
              deleted ? '' : <Card key={props._id} border="light" className="text-center" id="card">
              <Card.Header  id="card-header" as="h3"> {props.title}</Card.Header>
              <Card.Body id="card-body">
                <Row>
                  <Col>
                      <Card.Text><strong>Author: </strong> {props.author}</Card.Text>
                      <input type="text" id="post_id" value={props._id} hidden readOnly></input>
                  </Col>
                  <Col>
                      <Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text>
                  </Col>
                </Row>
                <Row>
                  <Col><Card.Text className="posts">{props.content}</Card.Text></Col>
                </Row>
              </Card.Body>
              <Card.Footer id="card-footer">
                  <span >{<Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>}</span>
                  <span>{props.author === localStorage.getItem('username') ? 
                      <Button id="button" variant="danger" onClick={() => remove()}>Delete</Button> 
                    : '' }</span>
              </Card.Footer>
            </Card>
            }
        </div>
    )
}

export default Postview;