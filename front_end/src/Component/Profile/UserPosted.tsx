import {useState, useEffect } from "react";
import axios from 'axios';
import {Button, Card, Row, Col} from 'react-bootstrap';
import {FaHeart} from "react-icons/fa"
import {FiHeart} from "react-icons/fi";
import Alert from 'react-bootstrap/Alert';
import ReactLoading from 'react-loading';
import moment from 'moment';


function UserPosted(props: any) {
    const [likes, setLikes] = useState(0);
    const [deleted, setDeleted] = useState(false);
    const [liked, setLiked] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
  
    const remove = () => {
      setDeleted(true);
      axios.delete(`/post/${props._id}`, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
    }
  
    const like = () => {
      if(liked) {
        console.log(liked, "token")
        setLiked(false)
        setLikes(likes - 1)
        axios.post(`/dislike`, {
        post_id: props._id}, {
        headers:{
          'Authorization': 'Bearer' + localStorage.getItem('token')}
      })
      }
      else if (!liked) {
        console.log("token")
        setLiked(true)
        setLikes(likes + 1)
        axios.post(`/like`, {
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
  
    useEffect(() => {
      userLiked();
    },[])
  
    return (
        <>{deleted ? ' ' :
            <Card border="light" className="text-center" id="card" style={{visibility: deleted ? "hidden" : "visible"}}>
                <Card.Header style={{background: '#C6F5FF'}} as="h3"> {props.title}</Card.Header>
                <Card.Body style={{background: '#E3FAFF'}}>
                <Row>
                    <Col>
                    <Card.Text><strong>Author: </strong> {props.author}</Card.Text>
                    <input type="text" id="post_id" value={props._id} hidden readOnly></input>
                    </Col>
                    <Col>
                    <Card.Text><strong>Posted: </strong> {moment(props.date_posted).fromNow()}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col><Card.Text className="posts">{props.content}</Card.Text></Col>
                </Row>
                </Card.Body>
                <Card.Footer id="card-footer">
                    <span >{<Button id="heart" onClick={() => like()}>{liked ? <FaHeart/> : <FiHeart />} {likes}</Button>}</span>
                    <span>{error && <Alert variant="danger" className="message">{message}</Alert>}</span>
                    <span><Button id="button" variant="outline-primary" onClick={() => remove()}>Delete</Button> </span>
                </Card.Footer>
            </Card>}
        </>
    )
  }


function UserPosted_Pageview() {
    // User Posted posts //
    const [posts, setPosts] = useState<any[]>([]);
    const [message] = useState('You have reached the end.');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // const [postLoading, setPostLoading] = useState(false);

    const [page, setPage] = useState<number>(0);
    const [limit] = useState(10);

    function handleScroll() {
        if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 300) {
          window.removeEventListener('scroll', handleScroll);
          setPage(page + 1);
        }
    }

    const userPosted = async () => {
        if(hasMore) {
            setLoading(true);
            const getPostsRes = await axios.get(`/user_post?&limit=${limit}&page=${page}`, {
                headers:{
                    'Authorization': 'Bearer' + localStorage.getItem('token')}
            });
            const postsInPage = getPostsRes.data.posts;
            postsInPage && setPosts((prev) =>
              [...new Set([...prev, ...postsInPage])]
            );
            
            window.addEventListener('scroll', handleScroll)
            if(postsInPage < 10 || getPostsRes.data.hasMore === false) {
                window.removeEventListener('scroll', handleScroll)
                setHasMore(false);
            }
        }
        setLoading(false);
}

    useEffect(() => {
        userPosted();
    }, [])

    return (
        <div>
            {posts.map(post => (
                <UserPosted key={post._id} author={post.author} _id={post._id} title={post.title} date_posted={post.date_posted} content={post.content}/>
            ))}
            {!loading ? <Alert id="message">{message}</Alert> : <ReactLoading type={'bars'} color={"darkblue"} height={100} width={100} className="loading"/>}
        </div>
    )
}

export default UserPosted_Pageview;