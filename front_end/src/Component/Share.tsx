import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Share() {
    const {id} = useParams<any>();
    const [loading, setLoading] = useState(true);
    const [posts, setPost] = useState<any[]>([]);
    const fetchPost = async () => {
        await axios.get(`/post/${id}`).then((res) => {
            console.log(res.data.post)
            setPost(res.data.post)
        })
    }

    useEffect(() => {
        fetchPost();
    }, [])
    return (
        <div className='body'>
            {!loading && posts.map(post => {
                <h1>Potato</h1>
            })}
        </div>
    )
}

export default Share;