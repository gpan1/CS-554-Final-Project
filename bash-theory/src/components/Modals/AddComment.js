import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from 'axios';

function CommentModal(props){
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ posterName: '', content: '' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const onClickHandler = async(e) => {
        //e.preventDefault();
        const data = {
            posterName: formData.posterName,
            content: formData.content,
            postId: props.data._id,
            date: new Date()
        };

        await axios.post(`http://localhost:4000/posts/addComment`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        e.persist();
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const modal = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onClickHandler}>
                    <Form.Group className="mb-3" controlId="formPosterName">
                        <Form.FloatingLabel controlId="floatingInput" label="Your Name" classname="mb-3">
                            <Form.Control type="text" placeholder="Your Name..." name="posterName" onChange={handleChange} value={formData.posterName} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formPosterDesc">
                        <Form.FloatingLabel controlId="floatingInput" label="Your comment...">
                            <Form.Control as="textarea" placeholder="Description" name="content" style={{ height: '100px' }} onChange={handleChange} value={formData.content}/>
                        </Form.FloatingLabel>
                    </Form.Group>
                    <br/>
                    <Form.Group className="mb-3">
                        <Button type="submit">Submit</Button>
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