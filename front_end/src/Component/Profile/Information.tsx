import { useState, useEffect } from "react";
import ReactLoading from 'react-loading';
import {Card, Row, Col} from 'react-bootstrap';

function Postview(props: any) {
    return  (
        <Card id="info">
            <Card.Header as="h3" className="text-center" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
            <Card.Body style={{background: '#FCEEFF'}}>
                <Row>
                    <Col md={6}><Card.Text><strong>Username:</strong> {props.username}</Card.Text></Col>
                    <Col md={6}><Card.Text><strong>Email:</strong> {props.email}</Card.Text></Col>
                </Row>
                <Row>
                    <Col md={6}><Card.Text><strong>Name:</strong> {props.firstname} {props.lastname}</Card.Text></Col>
                    <Col md={6}><Card.Text><strong>Phone:</strong> {props.phone}</Card.Text></Col>
                </Row>
                <Row>
                    <Col md={6}><Card.Text><strong>Roles:</strong> {props.roles}</Card.Text></Col>
                    <Col md={6}><Card.Text><strong>UserID:</strong> {props._id}</Card.Text></Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

function Pageview() {
    // User Info //
    const [info, setInfo] = useState<any[]>([]);
    const [infoLoading, setInfoLoading] = useState(true);

    const information = async () => {
        const fetchInfo = await fetch("http://127.0.0.1:5000/user",{
        headers:{
            'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        const data = await fetchInfo.json();
        setInfo(data);
        await data && setInfoLoading(false);
    };

    useEffect(() => {
        information();
    }, [])
    return (
        <div>
            {infoLoading ? <ReactLoading type={'bars'} color={"purple"} height={100} width={100} className="loading"/> : info.map(info => (
                <Postview key={info._id} firstname={info.firstname} lastname={info.lastname} username={info.username} email={info.email} _id={info._id} phone={info.phone} roles={info.roles} />
            ))}
        </div>
    )
}

export default Pageview;