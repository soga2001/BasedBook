import {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';
import Alert from 'react-bootstrap/Alert';
import Postview from './Postview';
import axios from 'axios';

function Pageview() {

    const [likedPost, setPost] = useState<any[]>([]);
    const [message] = useState('You have reached the end.');
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
            const getPostsRes = await axios.get(`/liked_posts?limit=${limit}&page=${page}`, {
                headers: {
                    'Authorization': 'Bearer' + localStorage.getItem('token')
                }
            })
            const postsInPage = getPostsRes.data.posts;
            await postsInPage && setPost((prev) =>
          [...new Set([...prev, ...postsInPage])]
            );
            if(postsInPage < 10 || getPostsRes.data.message) {
                window.removeEventListener('scroll', handleScroll);
                setHasMore(false);
                setLoading(false);
                return;
            }
            window.addEventListener('scroll', handleScroll);
            setLoading(false);
        }
    }

    useEffect(() => {
        post();
    }, [page])

    return (
        <div>
            {likedPost.map(post => (
                <Postview key={post._id} title={post.title} author={post.author} _id={post._id} content={post.content} date_posted={post.date_posted} />
            ))}
            {!loading ? <Alert id="message">{message}</Alert> : <ReactLoading type={'bars'} color={"darkblue"} height={100} width={100} className="loading"/>}
        </div>    
    )
}

export default Pageview