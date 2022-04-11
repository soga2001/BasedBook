import {useState, useEffect} from 'react';
import axios from 'axios';

function CommentView(props: any) {
    console.log(props)
    return (
        <div>
            <h1>{props.title}</h1>
            <h4>{props.username}</h4>
            <p>{props.comment}</p>
        </div>
    )

}

export default CommentView;