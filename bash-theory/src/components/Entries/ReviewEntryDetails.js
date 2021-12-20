import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Comment from "../Comment";
import CommentModal from "../Modals/AddComment";

function ReviewEntryDetails(props){
    const [data, setData] = useState({});
    const [showComments, setShowComments] = useState(true);

    useEffect(() => {
        async function fetchData(){
            const {data} = await axios.get(`http://localhost:4000/posts/byId/${props.data}`);
            setData(data);
        }

        fetchData();
    }, [props.data]);

    return (
        <div className="reviewEntry">
            <Row>
                <Col className="reviewRating">
                    <h1>{data.rating}/5</h1>
                </Col>
                <Col xs={10}>
                    <Row className="reviewHeader">
                        <h1>{data.posterName} - {data.title}</h1>
                        <h2>Reviewed on: {new Date(data.date).toDateString()}</h2>
                    </Row>
                    <Row className="reviewContent">
                        <p>{data.content}</p>
                    </Row>
                    <Row>
                        <CommentModal />
                        <Button variant="comment" onClick={() => setShowComments(!showComments)}>Show Comments</Button>
                        <div className="comments" hidden={showComments}>
                            {data.comments ? data.comments.map((item, i) => <Comment data={item} />) : "No Comments"}
                        </div>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default ReviewEntryDetails;