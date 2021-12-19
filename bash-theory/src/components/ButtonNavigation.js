import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ButtonNavigation() {
  let navigate = useNavigate();
  return (
    <div className="buttonHotbar">
      <Row>
        <Col>
          <Button
            variant="navigation"
            onClick={() => navigate("/listing/building")}
          >
            Buildings
          </Button>
        </Col>
        <Col>
          <Button
            variant="navigation"
            onClick={() => navigate("/listing/eatery")}
          >
            Eating Spots
          </Button>
        </Col>
        <Col>
          <Button
            variant="navigation"
            onClick={() => navigate("/listing/professor")}
          >
            Professors
          </Button>
        </Col>
        <Col>
          <Button
            variant="navigation"
            onClick={() => navigate("/listing/classes")}
          >
            Classes
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ButtonNavigation;
