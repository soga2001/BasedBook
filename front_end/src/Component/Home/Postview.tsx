import {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, Card, Row, Col, Form, Container} from 'react-bootstrap';
import moment from 'moment';

import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';




function Postview(props: any) {
    const [likes, setLikes] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState<Boolean>(false);
    const [rated, setRated] = useState<Boolean>(false);


    const [token] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    // Setting data
    const [title, setTitle] = useState(props.title);
    const [content, setContent] = useState(props.content);
    const [rating, setRating] = useState(0);
    const [currRating, setCurr] = useState(0);
    const [rateLoading, setRateloading] = useState(true);

    // Modal
    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
      setEdit(false);
    };
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
      if(!token) {
        setError(true)
        setMessage("You are not logged in.")
        return
      }
      if(liked) {
        setLiked(false)
        setLikes(likes-1)
      }
      else {
        setLiked(true)
        setLikes(likes+1)
      }
      axios.post(`http://127.0.0.1:5000/like`, {
        post_id: props._id}, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
    }
  
    const userLiked = () => {
      axios.get(`/liked/${props._id}`, {
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

    const userRated = async () => {
      await axios.get(`/post/rated/${props._id}`,{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        .then((res) => {
          if(res.data.rated) {
            setRated(true)
          }
          else {
            setRated(false)
          }
          setCurr(res.data.rating); 
          setRating(res.data.rating);
          
        })
      setRateloading(false);
    }

    const rate = () => {
      console.log(currRating)
      setRateloading(true)
      axios.post("/post/rate", {
        post_id: props._id,
        rating: currRating,
      },{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        }).then((res) => {
          setRated(true)
          console.log(res.data)
          userRated();
        })
        .catch((error) => {
          setError(true)
          setMessage("You are not logged in.")
        })
    }
  
    useEffect(() => {
      userRated();
      userLiked();
    },[])
  
    return (
        <div>
          {deleted ? "" : <Card onClick={() => setOpen(true)} id="card">
            <Card.Header  id="card-header" className="text-center" as="h1"> {title}</Card.Header>
            
            <Card.Body id="card-body">
              <Row className="text-center">
                <Col><Card.Text><strong>Author: </strong> {props.author}</Card.Text></Col>
                <Col><Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text></Col>
              </Row>
              <Row>
                <Col><Card.Text className="posts">{content}</Card.Text></Col>
              </Row>
            </Card.Body>
            <Card.Footer id="card-footer">
              <Stack direction="row" spacing={1} alignItems="center">
                {<span id="heart" style={{float: "left"}}>{liked ? <FavoriteSharpIcon/> : <FavoriteBorderSharpIcon />}</span>}
                <span>{likes}</span>
                <span>{" "}</span>
                <span>{" "}</span>
                <span>{" "}</span>
                <span>{!rateLoading ? <span><strong>Rating:</strong> {rating} out of 5</span> : <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined" className='loadingButton' > Loading</LoadingButton>}</span>
                <span>{!rateLoading ? <Rating size="large" name="simple-controlled" id='rating' defaultValue={rating} precision={.5} readOnly/>: ""}</span>
              </Stack>
            </Card.Footer>
          </Card>}
          <Modal open={open} onClose={handleClose} >
            <Container className="popUp">
              <hr/>
              <Row>
                <Col md={11} xs={10}>{!edit ? <h1 className='text-center'> {title}</h1> : <h1  className='text-center'><input defaultValue={title} type="text" id="newTitle" maxLength={50}></input></h1> }</Col>
                <Col md={1} xs={1} className="close" ><CloseIcon onClick={handleClose} fontSize="large"/></Col>
              </Row>
              
              <hr/>
              <Row className="text-center">
                <Col><Card.Text><strong>Author: </strong> {props.author}</Card.Text></Col>
                <Col><Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text></Col>
              </Row>
              <Row>
                {!edit && <Col><Card.Text className="popPost">{content}</Card.Text></Col>}
                {edit && <Form.Control defaultValue={content} as="textarea" id="newContent" rows={10} required/>}
              </Row>
              <Row>
                {edit && <span id="loading">{!loading ? <Button className="button" onClick={() => editPost()}>Submit</Button> : 
                <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined" className='loadingButton' > Saving</LoadingButton>}</span>}
              </Row>
              <Stack direction="row" spacing={14} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                <span><strong>Rating: </strong>  {rating}</span>
                  {!rateLoading ? <span > <Rating size="large" name="simple-controlled" id='rating' defaultValue={rating} onChange={(event, newValue: any) => setCurr(newValue)}/></span>
                  : <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined" className='loadingButton' > Loading</LoadingButton>}
                </Stack>
                <Col lg={6} sm={2}>{(<Button id="button" variant='success' onClick={() => rate()}>{rated ? "Change Rating" : "Rate"}</Button>)}</Col>
              </Stack>
              <hr/>
              <div>
                <span className="footers">{<IconButton id="heart" onClick={() => like()}>{liked ? <FavoriteSharpIcon/> : <FavoriteBorderSharpIcon />}</IconButton>} {likes} </span>
                {!edit && <span className="footers">{props.author === localStorage.getItem('username') ? <Button id="button" onClick={() => setEdit(true)}> <EditOutlinedIcon /> Edit</Button> 
                  : '' }</span>}
                <span className='footers' id="delete">{props.author === localStorage.getItem('username') ? 
                  <Button id="button" variant='danger' onClick={() => remove()}><DeleteIcon /> Delete</Button> 
                : '' }</span>
              </div>
              <span>{error && <Alert variant="filled" severity="error" className="message">{message}</Alert>}</span>
              <hr/>
              <div id="comments">
                <h3>Comments</h3>
              </div>
            </Container>
          </Modal>
        </div>
      
    )
  }

  export default Postview;