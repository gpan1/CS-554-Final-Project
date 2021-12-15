import React from "react";
import { Col, Row } from "react-bootstrap";
import NonLandingHeader from "./NonLandingHeader";
import noImage from "../noImage.png";

function ItemDetails(props){
    /* 
        The <p> tags are ultimately temporary.
        You can replace them with whatever you see fit to display information.
    */
    return (
        <>
        <NonLandingHeader />
        <div className="contentDiv">
            <Row>
                <Col>
                    <img src={noImage} alt="Test No AvailableImage" />
                    <div className="contentDetails">
                        <p>Name of Item</p>
                        <p>Type of Item</p>
                        <p>Average Rating:</p>
                        <p>Description:</p>
                    </div>
                </Col>
                <Col xs={8}>

                </Col>
            </Row>
        </div>
        </>
    )
}

export default ItemDetails;