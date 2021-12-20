import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from 'axios';

function CommentModal(props){
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ posterName: '', content: '' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const onClickHandler = async() => {
        const data = {
            posterName: formData.posterName,
            content: formData.content,
            id: props.data.locationId
        };

        console.log(data);

        await axios.post(`http://localhost:4000/posts/addComment`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const modal = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formPosterName">
                        <Form.FloatingLabel controlId="floatingInput" label="Your Name" classname="mb-3">
                            <Form.Control type="text" placeholder="Your Name..." onChange={handleChange} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formPosterDesc">
                        <Form.FloatingLabel controlId="floatingInput" label="Your comment...">
                            <Form.Control as="textarea" placeholder="Description" style={{ height: '100px' }} onChange={handleChange} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <br/>
                    <Form.Group className="mb-3">
                        <Button type="submit" onClick={() => onClickHandler()}>Submit</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            <Button variant="comment" onClick={handleShow}>
                Add Comment
            </Button>

            {modal}
        </>
    );
}

export default CommentModal;