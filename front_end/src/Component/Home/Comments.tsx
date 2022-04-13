import {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {ThumbDownAltOutlined, ThumbUpAltOutlined } from '@mui/icons-material';
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpOffAltRoundedIcon from '@mui/icons-material/ThumbUpOffAltRounded';
import {Alert, Rating, IconButton, Stack, Modal, TextField, Skeleton} from '@mui/material';

function Commentview(props: any) {

    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const handleLike = () => {
        if(!like){
            setDislike(false)
            setLike(true)
        }
        else {
            setLike(false)
        }
    }

    const handleDislike = () => {
        if(!dislike) {
            setLike(false)
            setDislike(true)
        }
        else {
            setDislike(false)
        }
    }

    return (
        <div id="comments">
            <Stack spacing={.5}>
                <h6>@{props.username}</h6>
                <p>{props.comment}</p>
                <span>
                    {moment(props.date_posted).fromNow()}
                </span>
                <Stack spacing={1} direction="row">
                    <IconButton onClick={handleLike}>{like ? <ThumbUpOffAltRoundedIcon/> : <ThumbUpAltOutlined/>}</IconButton>
                    <IconButton onClick={handleDislike}>{dislike ? <ThumbDownAltRoundedIcon/> : <ThumbDownAltOutlined/>}</IconButton>
                </Stack>
            </Stack>
        </div>
    )
}

export default Commentview;