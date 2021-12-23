import {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';
import Postview from './Postview';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

function Pageview() {
    const [posts, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [message] = useState('You have reached the end.'); 
  
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
        const getPostsRes = await axios.get(`/post?limit=${limit}&page=${page}`)
        const postsInPage = getPostsRes.data.posts;
        await postsInPage && setData((prev) =>
          [...new Set([...prev, ...postsInPage])]
        );
        if((postsInPage < 10) || (getPostsRes.data.hasMore === false)) {
          window.removeEventListener('scroll', handleScroll);
          setLoading(false);
          setHasMore(false);
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
        {posts.map(post => (
          <Postview key={post._id} _id={post._id} title={post.title} author={post.author} date_posted={post.date_posted} 
          content={post.content}/>
        ))}
        {loading ? <ReactLoading type={'bars'} color={"darkblue"} height={100} width={100} className="loading"/> : <Alert id="message">{message}</Alert>}
      </div>
    )
  }

  export default Pageview;