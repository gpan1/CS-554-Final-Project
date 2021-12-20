import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function CommentModal(){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const onClickHandler = () => {
        alert("hi");
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
                            <Form.Control type="text" placeholder="Your Name..." />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formPosterDesc">
                        <Form.FloatingLabel controlId="floatingInput" label="Your comment...">
                            <Form.Control as="textarea" placeholder="Description" style={{ height: '100px' }} />
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