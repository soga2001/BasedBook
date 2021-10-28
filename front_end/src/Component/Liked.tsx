import '../style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Container} from 'react-bootstrap';
import Pageview from "./Liked/Pageview";


function Liked() {
    return (
        <Container className="body">
            <h1 className="header">Liked Post</h1>
            <Pageview />
        </Container>
    )
}

export default Liked;