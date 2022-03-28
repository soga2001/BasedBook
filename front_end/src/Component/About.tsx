import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {Container, Button, Row, Col} from 'react-bootstrap';


class About extends Component {

    render() {
        return (
            <Container className='body'>
                <h1 className='text-center'>Welcome!!!</h1>
                <hr></hr>
                <div>
                    <h2>Q&A</h2>
                    <ol>
                        <li id="question">What is the purpose of this website?</li>
                        <p id="answer">Originally this was supposed to be a social media platform but soon after, I decided to turn this into a platform
                            where users are aviable to post their narrative stories. I, myself, love writing fictional stories and it brings a lot
                            creativity and joy in my life. I made this website because I want to read stories written by others.</p>
                        <li id="question">What was used to build this project?</li>
                        <p id="answers"> This website has 2 different components: <strong>Front-End</strong> and <strong>Back-End</strong>.
                            <ol>
                                <li><strong>Front-End</strong></li>
                                <p>For the front-end, I used <strong>React Typescript</strong> and <strong>CSS</strong>. It was a lot of work to build each page from scratch but honestly
                                    it was a lot of fun.
                                </p>
                                <li><strong>Back-End</strong></li>
                                <p>For the back-end, I used <strong>Flask</strong>. It was definitely the hardest part of my project, especially user authentication. It
                                    took me a long time to figure out user authentication which was the reason back-end was the hardest. I couldn't have done it without help. 
                                    For the database I used <strong>MongoDB </strong> which is definitely the best database program in my opinion.
                                </p>
                            </ol>
                        </p>
                        <li id="question">Current Features</li>
                        <ul>
                            <li>Login and Registration</li>
                            <li>Like stories you enjoy which you can find on the <strong>Liked</strong> page located in the dropdown menu on the right side of the Navbar when logged in, sorted by the latest liked</li>
                            <li>View your account information and the stories you have posted from the <strong>Profile</strong> page located in the dropdown menu which appears on the top right when logged in </li>
                            <li>Post your stories and the ability to delete it</li>
                            <li>Change Username and Password</li>
                            <li>Delete account</li>
                        </ul>
                        <li id="question">Features planned for the future</li>
                        <ul>
                            <li>Email verification</li>
                            <li>Comment Section for posts</li>
                            <li>Ability for the user to edit their post</li>
                            <li>Search for other users and view their posts</li>
                            <li>Search for posts based on genre</li>
                            <li>Rating system for each posts (story)</li>
                            <li>Roles (admin, operator, mod)</li>
                            <li>Discover page with the ability to filter posts based on likes, comments, latest, oldest, rating, etc</li>
                        </ul>
                    </ol>
                </div>
                <div className='home-page'>
                    <a href="/Home" className="button"><Button variant="primary" >Home Page</Button></a>
                </div>
                <div className='footer'>

                </div>
            </Container>
        )
    }
}

export default About;