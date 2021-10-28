import {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';
import Alert from 'react-bootstrap/Alert';
import Postview from './Postview';

function Pageview() {

    const [likedPost, setPost] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState<number>(0);
    const [limit] = useState(10);
  
    function handleScroll() {
      if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 300) {
        window.removeEventListener('scroll', handleScroll);
        setPage(page + 1);
      }
    }

    const post = async () => {
        if(hasMore) {
            setLoading(true);
            const fetchPost = await fetch(`http://127.0.0.1:5000/liked_posts?limit=${limit}&page=${page}`, {
                headers: {
                    'Authorization': 'Bearer' + localStorage.getItem('token')
                }
            })
            const jsonData = await fetchPost.json();
            await jsonData.posts && setPost([...likedPost, ...jsonData.posts]);
            window.addEventListener('scroll', handleScroll);
            if(jsonData.message) {
                window.removeEventListener('scroll', handleScroll);
                setMessage("You have reached the end of your liked posts.");
                setHasMore(false);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        post();
    }, [page])

    return (
        <div>
            {likedPost.map(post => (
                <Postview title={post.title} author={post.author} _id={post._id} content={post.content} date_posted={post.data_posted} />
            ))}
            {!loading ? <Alert id="message">{message}</Alert> : <ReactLoading type={'bars'} color={"darkblue"} height={100} width={100} className="loading"/>}
        </div>
            
    )
}

export default Pageview