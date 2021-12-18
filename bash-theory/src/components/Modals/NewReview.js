import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ReviewModal(){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const modal = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Post New Review
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formReviewerName">
                        <Form.FloatingLabel controlId="floatingInput" label="Your Name" classname="mb-3">
                            <Form.Control type="text" placeholder="Your Name" />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formReviewItem">
                        <Form.FloatingLabel controlId="floatingInput" label="Item to be Reviewed" classname="mb-3">
                            <Form.Control type="text" placeholder="Review Item" />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formReviewRating">
                        <Form.Label>Rating:</Form.Label>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="1" name="group1" type="radio" id={`inline-radio-1`} />
                            <Form.Check inline label="2" name="group1" type="radio" id={`inline-radio-2`} />
                            <Form.Check inline label="3" name="group1" type="radio" id={`inline-radio-3`} />
                            <Form.Check inline label="4" name="group1" type="radio" id={`inline-radio-4`} />
                            <Form.Check inline label="5" name="group1" type="radio" id={`inline-radio-5`} />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formReviewContent">
                        <Form.FloatingLabel controlId="floatingInput" label="Your thoughts...">
                            <Form.Control as="textarea" placeholder="Review" style={{ height: '100px' }} />
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
            <Button variant="modals" onClick={handleShow}>
                Post New Review
            </Button>

            {modal}
        </>
    );
}

export default ReviewModal;