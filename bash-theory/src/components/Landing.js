import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Header from './Header';
import Map from './Map';
import noImage from "../noImage.png";
function Landing() {
    return (
        <>
        <Header />
        <Container fluid>
            <Row className='landingRow'>
                <Col className='medColumn'>
                    <h1 className='side'>Popular Picks</h1>
                    <div className='box1'>
                        <div className='box2'>
                            <img src={noImage} alt="Test No AvailableImage" className='box2img'></img>
                        </div>
                        <div className='box3'>
                            <p>Patrick Hill. The man, the myth, the legend.</p>
                        </div>
                    </div>
                    <br></br>
                    <div className='box1'>
                        <div className='box2'>
                            <img src="https://mutekiramen.com/images/overview-img.jpg" className='box2img'></img>
                        </div>
                        <div className='box3'>
                            <p>Opened in 20XX, Muteki Ramen is a restaurant specializing in Japanese cuisine.</p>
                        </div>
                    </div>
                    <br></br>
                    <div className='box1'>
                        <div className='box2'>
                            <img src={noImage} alt="Test No AvailableImage" className='box2img'></img>
                        </div>
                        <div className='box3'>
                            <p>Opened in 20XX, Muteki Ramen is a restaurant specializing in Japanese cuisine.</p>
                        </div>
                    </div>
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
                    <div className="box1">
                        <p>Reviewer Name: John Booba</p>
                        <p>Review Item: Adam Szyluk</p>
                        <p>Rating: 0</p>
                        <p>Review: Adam Stinky!</p>
                    </div>
                    <br></br>
                    <div className="box1">
                        <p>Reviewer Name: John Smith</p>
                        <p>Review Item: Adam Szyluk</p>
                        <p>Rating: 0</p>
                        <p>Review: Adam Smelly!</p>
                    </div>
                    <br></br>
                    <div className="box1">
                        <p>Reviewer Name: Adam Szyluk</p>
                        <p>Review Item: Adam Szyluk</p>
                        <p>Rating: 5</p>
                        <p>Review: I love his manly musk</p>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default Landing;