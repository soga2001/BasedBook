import {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import moment from 'moment';
import CommentView from './Comments';

import LoadingButton from '@mui/lab/LoadingButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {Alert, Rating, IconButton, Stack, Modal, TextField, Skeleton, SpeedDial, SpeedDialIcon, SpeedDialAction} from '@mui/material';
import { DeleteForever, Save, Close, Favorite, FavoriteBorder } from '@mui/icons-material';

function Postview(props: any) {
    const [likes, setLikes] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState<Boolean>(false);
    const [rated, setRated] = useState<Boolean>(false);


    const [token] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Setting data
    const [title, setTitle] = useState(props.title);
    const [content, setContent] = useState(props.content);
    const [rating, setRating] = useState(0);
    const [currRating, setCurr] = useState(0);
    const [total, setTotal] = useState(0);
    const [userRating, setUser] = useState(0);
    const [rateLoading, setRateloading] = useState(true);

    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      !loading && setOpen(true);
      !loading && window.history.pushState({}, '', `/Share/${props._id}`)
    }
    const handleClose = () => {
      setOpen(false);
      setEdit(false);
      window.history.back();
    };
    const [edit, setEdit] = useState(false);


    // Comments
    const [commentLoading, setComLoading] = useState(true);
    const [comments, setComments] = useState<any[]>([]);
    const [hasComments, setHas] = useState(false)

  
    const remove = () => {
      setDeleted(true);
      setOpen(false);
      axios.delete(`/post/${props._id}`, {
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
          setLoading(false)
        })
        .catch((error) => {})
    }

    const userRated = async () => {
      await axios.get(`/post/rated/${props._id}`,{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        .then((res) => {
          if(res.data.rated === true) {
            setRated(true)
            setUser(res.data.userRating)
          }
          else {
            setRated(false)
          }
          setRating(res.data.rating);
          setTotal(res.data.total);
          
        })
      setRateloading(false);
    }

    const rate = () => {
      setRateloading(true)
      axios.post("/post/rate", {
        post_id: props._id,
        rating: currRating,
      },{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        }).then((res) => {
          setRated(true)  
          userRated();
        })
        .catch((error) => {
          setRateloading(false)
          setError(true)
          setMessage("You are not logged in.")
        })
    }

    const unrate = () => {
      setRateloading(true)
      axios.delete(`/post/unrate/${props._id}`, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        }).then((res) => {
          setRated(false)  
          userRated();
        })
    }

    const postComment = (e: any) => {
      e.preventDefault();
      setComLoading(true)
      const title = (document.getElementById("comment-title") as HTMLInputElement).value
      const comment = (document.getElementById("comment") as HTMLInputElement).value
      axios.post("/post/comment", {
        post_id: props._id,
        title: title,
        comment: comment
      },{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        }).then((res) => {
          (document.getElementById("comment-title") as HTMLInputElement).value = "";
          (document.getElementById("comment") as HTMLInputElement).value = "";
        })
        .catch((error) => {
          alert("Error")
        })
    }

    const fetchComment = async () => {
      setComLoading(true);
      await axios.get(`/post/comment/${props._id}`,{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        .then((res) => {
          if(res.data.comments.length != 0) {
            setComments(res.data.comments)
            setHas(true)
          }
          else{
            setHas(false)
          }
          
        });
      setComLoading(false);
    }
  
    useEffect(() => {
      fetchComment();
      userRated();
      userLiked();
    },[])

    const options = [
      { icon: <Save />, name: 'Save'},
      { icon: <DeleteForever />, name: 'Delete'}
    ];
  
    return (
        <div>
          {deleted ? "" : <Card onClick={handleOpen} id="card">
            <Stack alignItems="center" id="card-header">
                {loading ? <Skeleton variant="text" width={100} height={60} animation="wave" sx={{ bgcolor: 'black.300' }} />
                : <Card.Header  id="card-header" className="text-center" as="h1"> {title}</Card.Header>}
            </Stack>
            <Card.Body id="card-body">
              <Row className="text-center">
                <Col>{loading ? <Skeleton variant="text" animation="wave" sx={{ bgcolor: 'black.300' }} /> : <Card.Text><strong>Author: </strong> {props.author}</Card.Text>}</Col>
                <Col>{loading ? <Skeleton variant="text" animation="wave" sx={{ bgcolor: 'black.300' }} /> : <Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text>}</Col>
              </Row>
              <Row>
                <Col>{loading ? <Skeleton variant="rectangular" height={93} animation="wave" sx={{ bgcolor: 'black.300' }} /> : <Card.Text className="posts">{content}</Card.Text>}</Col>
              </Row>
              <div id="checking">
                </div>
            </Card.Body>
            <Card.Footer id="card-footer">
              <Stack direction="row" spacing={1} alignItems="center" >
                {loading ? <Skeleton variant="circular" width={20} height={20} animation="wave" sx={{ bgcolor: 'red.1000' }} /> :<span id="heart" style={{float: "left"}}>{liked ? <Favorite/> : <FavoriteBorder />}</span>}
                <span>{loading ? <Skeleton variant="text" width={20} height={20} animation="wave" sx={{ bgcolor: 'red.1000' }} /> : ""}</span>
                <span>{!loading && likes}</span>
                <span></span>
                <span>{!loading ? (!rateLoading  ? <span><strong>Rating:</strong> {rating}/5 ({total})</span> : <Skeleton variant="text" width={200} animation="wave" sx={{ bgcolor: 'black.300' }}/>) 
                : <Skeleton variant="text" width={200} animation="wave" sx={{ bgcolor: 'black.300' }}/>}</span>
                <span>{!loading && (!rateLoading ? <Rating size="large" name="simple-controlled" id='rating' defaultValue={rating} precision={.5} readOnly/>: "")}</span>
              </Stack>
            </Card.Footer>
          </Card>}
          <Modal open={open} onClose={handleClose} >
            <Container className="popUp">
              <hr/>
              <Row>
                <Col md={1} xs={1}></Col>
                <Col md={10} xs={9}><Stack alignItems="center">
                  {!edit ? <h1 className='text-center'> {title}</h1> : <h1><TextField className='edit' id="newTitle" label="Title" variant="outlined" defaultValue={title} /></h1> }
                </Stack></Col>
                {/* <Col md={10} xs={9}>{!edit ? <h1 className='text-center'> {title}</h1> : <h1><TextField className='edit' id="newTitle" label="Title" variant="outlined" defaultValue={title} /></h1> }</Col> */}
                <Col md={1} xs={1} ><Close onClick={handleClose} fontSize="large" className="close"/></Col>
              </Row>
              
              <hr/>
              <Row className="text-center">
                <Col><Card.Text><strong>Author: </strong> {props.author}</Card.Text></Col>
                <Col><Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()} </Card.Text></Col>
              </Row>
              <Row>
                {!edit && <Col><Card.Text className="popPost">{content}</Card.Text></Col>}
                {edit && <TextField fullWidth defaultValue={content} className='edit' id="newContent" label="Story" multiline rows={20} variant="outlined" />}
              </Row>
              <Row>
                {edit && <span id="loading">{!loading ? <Button className="button" onClick={() => editPost()}>Save</Button> : 
                <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined" className='loadingButton' > Saving</LoadingButton>}</span>}
              </Row>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={0} alignItems="center">
                <span><strong>{rated ? "Rating:" : "Rate:"}</strong>  {rating}</span>
                <span>{!rateLoading ? <Rating size="large" name="simple-controlled" id='rating' defaultValue={rating} onChange={(event, newValue: any) => {newValue !== null ? setCurr(newValue) : setCurr(0)}}/>
                : <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined" className='loadingButton' > Saving</LoadingButton>}</span>
                </Stack>
              </Stack>
              <Stack spacing={2} direction="row">
                {rated && <span>Your rating: {userRating}</span>}
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                {(currRating !== null) ? <Button id="button" variant='success' onClick={() => rate()}>{rated ? "Change Rating" : "Rate"}</Button> : ""}
                { rated &&  (<Button id="button" variant='success' onClick={() => unrate()}>Unrate</Button>)}
              </Stack>
              <hr/>
              <div>
                <span className="footers">{<IconButton id="heart" onClick={() => like()}>{liked ? <Favorite/> : <FavoriteBorder />}</IconButton>}  {likes} </span>
                {!edit && <span className="footers">{props.author === localStorage.getItem('username') ? <Button id="button" onClick={() => setEdit(true)}> <EditOutlinedIcon /> Edit</Button> 
                  : '' }</span>}
                <span className='footers' id="delete">{props.author === localStorage.getItem('username') ? 
                  <Button id="button" variant='danger' onClick={() => remove()}><DeleteForever /> Delete</Button> 
                : '' }</span>
              </div>
              <span>{error && <Alert variant="filled" severity="error" className="message" onClose={() => setError(false)}>{message}</Alert>}</span>
              <hr/>
              <div id="comments">
                <h3>Comments</h3>
                <form onSubmit={postComment}>
                  <Stack spacing={2}>
                    <TextField size="small" className='comment' id="comment-title" label="Title" variant="outlined" required/>
                    <TextField size="small" className='comment' id="comment" label="Comment" variant="outlined" multiline rows={5} required/>
                    <Button type="submit" variant="outline-primary" className='button'>Post</Button>
                  </Stack>
                </form>
                {!hasComments ? "" : comments.map(comment => {
                  <CommentView key={comment._id} title={comment.title} username={comment.username}/>

                })}
              </div>
            </Container>
          </Modal>
        </div>
      
    )
  }

  export default Postview;