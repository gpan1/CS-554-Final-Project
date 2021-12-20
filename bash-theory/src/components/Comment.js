import React from "react";
import { Row } from 'react-bootstrap';

function Comment(props){
    return (
        <div>
            <Row className="commentHeader">
                <h1>{props.data.posterName} - Commented on: {new Date(props.data.date).toDateString()}</h1>
            </Row>
            <Row className="commentContent">
                <p>{props.data.content}</p>
            </Row>
        </div>
    )
}

export default Comment;