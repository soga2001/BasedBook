import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Commentview from './Home/Comments';

import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import moment from 'moment';

import LoadingButton from '@mui/lab/LoadingButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {Alert, Rating, IconButton, Stack, TextField} from '@mui/material';
import { DeleteForever, Save, Favorite, FavoriteBorder } from '@mui/icons-material';

function Share() {
    const {id} = useParams<any>();
    const [loading, setLoading] = useState(true);
    const [posts, setPost] = useState<any[]>([]);
    const fetchPost = async () => {
        await axios.get(`/post/${id}`).then((res) => {
            setPost(res.data.post)
        });
        setLoading(false)
    }

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <Container className='body'>
            {!loading && <PostView data={posts} />}
        </Container>
    )
}

function PostView(props: any) {
    const [likes, setLikes] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState<Boolean>(false);
    const [rated, setRated] = useState<Boolean>(false);


    const [token] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Setting data
    const [title, setTitle] = useState(props.data.title);
    const [content, setContent] = useState(props.data.content);
    const [rating, setRating] = useState(0);
    const [currRating, setCurr] = useState(0);
    const [total, setTotal] = useState(0);
    const [userRating, setUser] = useState(0);
    const [rateLoading, setRateloading] = useState(true);

    const [edit, setEdit] = useState(false);


    // Comments
    const [commentLoading, setComLoading] = useState(true);
    const [comments, setComments] = useState<any[]>([]);
    const [commentCount, setCount] = useState(0);

  
    const remove = () => {
      setDeleted(true);
      axios.delete(`/post/${props.data._id}`, {
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
        post_id: props.data._id}, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
    }
  
    const userLiked = () => {
      axios.get(`/liked/${props.data._id}`, {
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
      await axios.get(`/post/rated/${props.data._id}`,{
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
        post_id: props.data._id,
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
      axios.delete(`/post/unrate/${props.data._id}`, {
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
      const comment = (document.getElementById("comment") as HTMLInputElement).value
      axios.post("/post/comment", {
        post_id: props.data._id,
        comment: comment
      },{
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
        }).then((res) => {
          fetchComment();
          (document.getElementById("comment") as HTMLInputElement).value = "";
        })
        .catch((error) => {
          alert("Error")
        })
    }

    const fetchComment = async () => {
      setComLoading(true);
      const getComment = await axios.get(`/post/comments?id=${props.data._id}&offset=${commentCount}`)
      const fetchedComment = getComment.data.comments;
      const count = getComment.data.count;
      await fetchedComment && setComments([...comments, ...fetchedComment])
      await count && setCount(count)
      setComLoading(false);
    }
  
    useEffect(() => {
      fetchComment();
      userRated();
      userLiked();
    },[])
    return (
        <Container className="">
            <hr/>
            <Stack alignItems="center">
                {!edit ? <h1 className='text-center'> {title}</h1> : <h1><TextField className='edit' id="newTitle" label="Title" variant="outlined" defaultValue={title} /></h1> }
            </Stack>
              
            <hr/>
            <Row className="text-center">
            <Col><Card.Text><strong>Author: </strong> {props.data.author}</Card.Text></Col>
            <Col><Card.Text><strong>Posted: </strong> {moment(props.data.date_posted).fromNow()} </Card.Text></Col>
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
            <span><strong>{rated ? "Rating:" : "Rate:"}</strong>  {rating} ({total})</span>
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
            {!edit && <span className="footers">{props.data.author === localStorage.getItem('username') ? <Button id="button" onClick={() => setEdit(true)}> <EditOutlinedIcon /> Edit</Button> 
                : '' }</span>}
            <span className='footers' id="delete">{props.data.author === localStorage.getItem('username') ? 
                <Button id="button" variant='danger' onClick={() => remove()}><DeleteForever /> Delete</Button> 
            : '' }</span>
            </div>
            <span>{error && <Alert variant="filled" severity="error" className="message" onClose={() => setError(false)}>{message}</Alert>}</span>
            <hr/>
            <div id="comments">
            <h3>Comments</h3>
            <form onSubmit={postComment}>
                <Stack spacing={2}>
                <TextField size="small" className='comment' id="comment" label="Comment" variant="outlined" multiline rows={5} required/>
                <Button type="submit" variant="outline-primary" className='button'>Post</Button>
                </Stack>
            </form>
            <hr/>
            {comments.map(comment => (
                <Commentview key={comment._id} _id={comment._id} title={comment.title} username={comment.username} comment={comment.comment} date_posted={comment.date_posted} post_id={comment.postId}/>
            ))}
            </div>
        </Container>
    )
}

export default Share;