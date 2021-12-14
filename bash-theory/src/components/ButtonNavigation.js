import React from "react";
import { Button, Col, Row } from "react-bootstrap";

function ButtonNavigation(){
    return (
        <div className="buttonHotbar">
            <Row>
                <Col>
                    <Button variant="navigation">Buildings</Button>
                </Col>
                <Col>
                    <Button variant="navigation">Eating Spots</Button>
                </Col>
                <Col>
                    <Button variant="navigation">Professors</Button>
                </Col>
                <Col>
                    <Button variant="navigation">Classes</Button>
                </Col>
            </Row>
        </div>
    )
}

export default ButtonNavigation;