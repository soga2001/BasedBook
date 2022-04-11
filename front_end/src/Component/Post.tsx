import React, { Component } from "react";
import axios from "axios";
import {Button, Card, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { Check_token } from "./Token";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';


const genres = [
    { genre: "Science Fiction"},
    { genre: "Fantasy Fiction"},
    { genre: "Horrer Fiction" },
    { genre: "Supernatural Fiction"},
    { genre: "Superhero Fiction"},
    { genre: "Utopian Fiction"},
    { genre: "Dystopian Fiction"},
    { genre: "Apocalyptic Fiction"},
    { genre: "Post-apacolyptic Fiction"},
    { genre: "Alternate History"},
    { genre: "Suspense"},
    { genre: "Thriller"}
]

class Post extends Component {
    state = {err: '', message: '', arr: []}

    post = (e: any) => {
        e.preventDefault(); // so that the page doesn't refresh everytime ths submit button if pressed.
        console.log(this.state.arr)
        axios.post("/post", {
            title: (document.getElementById('title') as HTMLInputElement).value,
            content: (document.getElementById('story') as HTMLInputElement).value
        }, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res) => {
            this.setState({err: ''})
            this.setState({message: "Posted"})
            setTimeout(()=>window.location.href = '/Home', 800)
        })
        .catch((err) => {
            if (localStorage.getItem('token')) {
                Check_token()
            }
            else {
                this.setState({message: ''})
                this.setState({err: "Please login before trying to post a content."})
            }
        })
    }

    tab = (event: any) => {
        if(event.key = "tab") {
            alert("potato")
        }
    }

    render() {
        return (
            <Container className="body" style={{padding: '1%'}}>
                <Card border="light" style={{ width: '70%', margin: 'auto' }}>
                    <Card.Header as='h3' className="header" style={{background: '#FFD9AE'}}>Post Content</Card.Header>
                    <Card.Body style={{width: '100%', margin: 'auto', background: "#FFEBD4"}}>
                        <form className="post"onSubmit={this.post}>
                            <Stack spacing={2}>
                                <TextField fullWidth id="title" label="Title" required/>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={genres}
                                    getOptionLabel={(option) => option.genre}
                                    filterSelectedOptions
                                    onChange={(event, value) => {this.setState({arr: [...new Set([...this.state.arr, ...value])]})}}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fictional Genres *"
                                        placeholder="Science Fiction"
                                        variant="outlined"
                                    />
                                    )}
                                />
                                <TextField multiline fullWidth id="story" label="Story" rows={15} variant="outlined" required/>
                                <Button type="submit" variant="outline-primary" className='button'>Post</Button>
                            </Stack>
                        </form>
                        {this.state.err ? <Alert className="message">{this.state.err}</Alert>: this.state.message && <Alert className="message">{this.state.message}</Alert>}
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default Post;