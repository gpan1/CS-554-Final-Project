import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Collapse, Row } from "react-bootstrap";
import Comment from "../Comment";
import CommentModal from "../Modals/AddComment";

function ReviewEntryDetails(props){
    const [data, setData] = useState({});
    const [showComments, setShowComments] = useState(false);

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
                        <CommentModal data={data} />
                        <Button variant="comment" onClick={() => setShowComments(!showComments)}>Show Comments</Button>
                        <Collapse in={showComments}>
                            <div>
                                {(data.comments && data.comments.length > 0) ? data.comments.map((item, i) => <Comment data={item} />) : <p className="noComment">No comments.</p>}
                            </div>
                        </Collapse>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default ReviewEntryDetails;