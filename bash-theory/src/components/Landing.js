import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Header from './Header';
import Map from './Map';

function Landing() {
    return (
        <>
        <Header />
        <Container fluid>
            <Row className='landingRow'>
                <Col className='medColumn'>
                    <h1 className='side'>Popular Picks</h1>
                </Col>
                <Col xs={5} className="lgColumn">
                    <div className='navButtons'>
                        <Row>
                            <Col>
                                <Button variant="navigation">Buildings</Button>
                            </Col>
                            <Col>
                                <Button variant="navigation">Eating Spots</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="navigation">Professors</Button>
                            </Col>
                            <Col>
                                <Button variant="navigation">Classes</Button>
                            </Col>
                        </Row>
                    </div>
                    <Map />
                </Col>
                <Col className='medColumn'>
                    <h1 className='side'>Recent Reviews</h1>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default Landing;