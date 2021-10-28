import 'bootstrap/dist/css/bootstrap.css';
import {Container} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import Pageview from './Home/PageView'

function Home() {
  return (
    <Container className="body">
      <h1 className="header">Home Page</h1>
      <FadeIn>
        <Pageview />
      </FadeIn>
    </Container>
  )
}

export default Home;