import React from "react";
import { Col, Row } from "react-bootstrap";
import noImage from "../../noImage.png";

/**
 * Meant for any list of items
 * 
 * Expected props: {name, description, avgRating, imgUrl (optional), address}
 * @param {object} props 
 * @returns 
 */
function ItemListEntry(props) {
  
    return (
      <>
        <div className="listEntry">
          <Row>
            <Col>
              <img src={props.post.imgUrl ? props.post.imgUrl : noImage} alt={`${props.post.name}`} />
            </Col>
            <Col xs={10}>
              <Row className="listEntry-title">
                  <h2>{props.post.name}</h2>
              </Row>
              <Row className="listEntry-desc">
                <Col xs={10}>
                  {props.post.description}
                </Col>
                <Col className="listEntry-avgRating">
                  <div>
                  {props.post.avgRating}/5
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <br/>
      </>
    )
}

export default ItemListEntry;