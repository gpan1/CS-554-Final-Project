import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import NonLandingHeader from "./NonLandingHeader";
import noImage from "../noImage.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReviewEntryDetails from "./Entries/ReviewEntryDetails";
import ReviewModal from "./Modals/NewReview";

function ItemDetails(){
    const [data, setData] = useState({});
    let params = useParams();

    useEffect(() => {
        async function fetchData(){
            const { data } = await axios.get(`http://localhost:4000/locations/byId/${params.id}`);
            setData(data);
        }

        fetchData();
    }, [params.id]);


    return (
        <>
        <NonLandingHeader />
        <div className="contentDiv">
            <Row>
                <Col>
                    <img src={data.imgUrl ? data.imgUrl : noImage} alt="Test No AvailableImage" />
                    <div className="contentDetails">
                        <h1>{data.name}</h1>
                        <h2>{data.tags}</h2>
                        <h3>Average Rating: {data.avgRating ? data.avgRating : "None"}</h3>
                        <hr/>
                        <p>{data.description}</p>
                    </div>
                </Col>
                <Col xs={8}>
                    <ReviewModal/>
                    <hr/>
                    {(data.posts && data.posts.length > 0) ? data.posts.map((item, i) => <ReviewEntryDetails key={i} data={item} />) : <p className="noComment">No Reviews</p>}
                </Col>
            </Row>
        </div>
        </>
    )
}

export default ItemDetails;