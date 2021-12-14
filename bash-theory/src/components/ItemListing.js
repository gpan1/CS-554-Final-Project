import React from "react";
import { Col, Row } from "react-bootstrap";
import NonLandingHeader from "./NonLandingHeader";
import Map from "./Map";

function ItemListing(props){
    // You guys are responsible for the search bar, can't be bothered to do make it myself
    // Under the lgColumn, iterate item listings thru props, linking each result to the item details
    return (
        <>
        <NonLandingHeader />
        <div className="listingDiv">
            <h1 style={{ marginBottom: "2rem" }}>Type of Item: Use props or something.</h1>
            <div className="itemList">
                <Row>
                    <Col xs={8} className="lgColumn">

                    </Col>
                    <Col>
                        <Map />
                    </Col>
                </Row>
            </div>
        </div>
        </>
    )
}

export default ItemListing;