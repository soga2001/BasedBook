import { useState, useEffect } from "react";
import ReactLoading from 'react-loading';
import {Card, Row, Col} from 'react-bootstrap';
import axios from "axios";

function hideEmail(emailAddress: string) {
    const [first, last] = emailAddress.split('@')
    return first.substring(0,1) + first.substr(1, first.length - 1).replace(/\w/g, '*') + first.substr(-1, 1) + '@' + last;
}

function Postview(props: any) {
    return  (
        <Card id="info">
            <Card.Header as="h3" className="text-center" style={{background: '#F9DBFF'}}>Your Info</Card.Header>
            <Card.Body style={{background: '#FCEEFF'}}>
                <Row>
                    <Col md={6}><Card.Text><strong>Username:</strong> {props.username}</Card.Text></Col>
                    <Col md={6}><Card.Text><strong>Email:</strong> {hideEmail(props.email)}</Card.Text></Col>
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
        const fetchInfo = await axios.get("/user",{
        headers:{
            'Authorization': 'Bearer' + localStorage.getItem('token')}
        })
        const data = await fetchInfo.data;
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