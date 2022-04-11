import {useState, useEffect} from 'react';
import Postview from './Postview';
import axios from 'axios';

import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';

function Pageview() {
    const [posts, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
  
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState(0);
    const [pagLoading, setPag] = useState(true);
    const [limit] = useState(6);
    
    const totalPost = async () => {
      setPag(true)
      const fetch = await axios.get(`/post/count`)
      const total = fetch.data.count;
      setCount(total)
      if(page * limit > total){
        setMessage('You have reached the end.')
      }
      else {
        setMessage("")
      }
      setPag(false);
    }

    const post = async () => {
      setLoading(true);
      const getPostsRes = await axios.get(`/post?limit=${limit}&page=${page}`)
      const postsInPage = getPostsRes.data.posts;
      await postsInPage && setData(postsInPage);
      setLoading(false);

    }
  
    useEffect(() => {
      totalPost();
      post();
    }, [page])

  
    return (
      <div>
        <div id="mapping">
          {posts.map(post => (
              <Postview key={post._id} _id={post._id} title={post.title} author={post.author} date_posted={post.date_posted} 
              content={post.content}/>
          ))}
          {message ? <Alert variant="filled" severity="info" className="message" onClose={() => setMessage("")}>{message}</Alert> : ""}
        </div>
        <Stack alignItems="center" id="pagination">
          {!pagLoading ? <Pagination count={Math.ceil(count/limit)} page={page} onChange={(event, newPage) => setPage(newPage)} color="primary" /> :
          <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined" className='loadingButton' > Loading</LoadingButton> }
        </Stack>
      </div>
    )
  }

  export default Pageview;