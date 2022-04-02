import {useState, useEffect} from 'react';
import axios from 'axios';
import { FaHeart} from "react-icons/fa";
import Alert from 'react-bootstrap/Alert';
import {FiHeart} from "react-icons/fi";
import {Button, Card, Row, Col, Form} from 'react-bootstrap';
import moment from 'moment';
import ReactLoading from 'react-loading';


function Postview(props: any) {
    const [likes, setLikes] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState<Boolean>();
    const [token] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    // Setting data
    const [title, setTitle] = useState(props.title)
    const [content, setContent] = useState(props.content)

    const [edit, setEdit] = useState(false);
  
    const remove = () => {
      setDeleted(true);
      axios.delete(`http://127.0.0.1:5000/post/${props._id}`, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
    }

    const editPost = () => {
      setLoading(true)
      const title = (document.getElementById("newTitle") as HTMLInputElement).value;
      const content = (document.getElementById("newContent") as HTMLInputElement).value;
      setTitle(title)
      setContent(content)
      axios.put('/edit_post', {
        title: title,
        content: content,
        id: props._id
      }, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
      .then((res) => {
        if(res.data.success){
          setTitle(title)
          setContent(content)
        }
        setLoading(false)
        setEdit(false)
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
          setLikes(res.data.likes)
        })
    }
  
    useEffect(() => {
      userLiked();
    },[])
  
    return (
        <div>
          {
          deleted ? '' : <Card key={props._id} border="light" className="text-center" id="card">
          {!edit && <Card.Header  id="card-header" as="h3"> {title}</Card.Header>}
          {edit && <Card.Header  id="card-header" as="h3"><input defaultValue={title} type="text" id="newTitle"></input></Card.Header>}
          <Card.Body id="card-body">
            <Row>
              <Col>
                  {<Card.Text><strong>Author: </strong> {props.author}</Card.Text>}
                  <input type="text" id="post_id" value={props._id} hidden readOnly></input>
              </Col>
              <Col>
                  <Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text>
              </Col>
            </Row>
            <Row>
              {!edit && <Col><Card.Text className="posts">{content}</Card.Text></Col>}
              {edit && <Form.Control defaultValue={content} as="textarea" id="newContent" rows={10} required/>}
            </Row>
            <Row>
              {edit && <span>{!loading ? <Button id="button" onClick={() => editPost()}>Submit</Button> : <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/>}</span>}
            </Row>
          </Card.Body>
          <Card.Footer id="card-footer">
              <span >{<Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>}</span>
              <span>{error && <Alert variant="danger" className="message">{message}</Alert>}</span>
              <span>{props.author === localStorage.getItem('username') ? 
                  <Button id="button" variant='danger' onClick={() => remove()}>Delete</Button> 
                : '' }</span>
                {!edit && <span>{props.author === localStorage.getItem('username') ? <Button id="button" onClick={() => setEdit(true)}>Edit</Button> 
                : '' }</span>}
          </Card.Footer>
        </Card>
        }</div>
      
    )
  }

  export default Postview;