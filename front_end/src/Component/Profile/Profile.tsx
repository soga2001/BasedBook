import '../../style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Container} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import Pageview from "./Information";
import UserPosted_Pageview from "./UserPosted";

function Profile() {
  return (
    <Container className="body">
      <h1 className="header">Profile</h1>
      <hr></hr>
      <Pageview />
      <hr></hr>
      <h1 className="header">Your Posts</h1>
      <hr></hr>
      <FadeIn>
        <UserPosted_Pageview />
      </FadeIn>
    </Container>
  )
}

export default Profile;