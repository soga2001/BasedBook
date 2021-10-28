import {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';
import Postview from './Postview';
import Alert from 'react-bootstrap/Alert';

function Pageview() {
    const [posts, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [message, setMessage] = useState(''); 
  
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
        const fetchPost = await fetch(`http://127.0.0.1:5000/post?limit=${limit}&page=${page}`);
        const jsonData = await fetchPost.json();
        await jsonData.posts && setData((prev) =>
          [...new Set([...prev, ...jsonData.posts])]
        );
        // Supposedly the setData() above makes sure there are no duplicate posts in the array, didn't actually work.
        window.addEventListener('scroll', handleScroll)
        if((jsonData.posts < 10) || (jsonData.hasMore === false)) {
          window.removeEventListener('scroll', handleScroll)
          setMessage("There have reached the end.");
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
        {posts.map(post => (
          <Postview key={post._id} _id={post._id} title={post.title} author={post.author} date_posted={post.date_posted} 
          content={post.content}/>
        ))}
        {!loading ? <Alert id="message">{message}</Alert> : <ReactLoading type={'bars'} color={"darkblue"} height={100} width={100} className="loading"/>}
      </div>
    )
  }

  export default Pageview;