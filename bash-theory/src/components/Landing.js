import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import PopularPicks from "./PopularPicks";
import RecentReviews from "./RecentReviews";
import Map from "./Map";
function Landing() {
  let navigate = useNavigate();
  return (
    <>
      <Header />
      <Container fluid>
        <Row className="landingRow">
          <Col className="medColumn">
            <h1 className="side">Popular Picks</h1>
            <PopularPicks />
          </Col>
          <Col xs={5} className="lgColumn">
            <div className="navButtons">
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
              </Row>
              <Row>
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
            <Map />
          </Col>
          <Col className="medColumn">
            <h1 className="side">Recent Reviews</h1>
            <RecentReviews />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Landing;
