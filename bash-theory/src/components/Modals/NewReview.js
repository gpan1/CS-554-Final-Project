import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

function ReviewModal(props){
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ posterName: '', title: '', content: '', rating: 0 });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const onClickHandler = async(e) => {
        //e.preventDefault();
        const data = {
            posterName: formData.posterName,
            title: formData.title,
            content: formData.content,
            locationId: props.data._id,
            date: new Date(),
            location: props.data.location,
            tags: props.data.tags,
            rating: parseInt(formData.rating)
        };

        await axios.post(`https://ancient-beyond-29069.herokuapp.com/posts/add`, data)
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
                    Post New Review
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onClickHandler}>
                    <Form.Group className="mb-3" controlId="formReviewerName">
                        <Form.FloatingLabel controlId="floatingInput" label="Your Name" classname="mb-3">
                            <Form.Control type="text" placeholder="Your Name" name="posterName" onChange={handleChange} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formReviewTitle">
                        <Form.FloatingLabel controlId="floatingInput" label="Title of Review" classname="mb-3">
                            <Form.Control type="text" placeholder="Review Title" name="title" onChange={handleChange} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formReviewRating">
                        <Form.Label>Rating:</Form.Label>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="1" value="1" name="rating" type="radio" id={`inline-radio-1`} onChange={handleChange}/>
                            <Form.Check inline label="2" value="2"name="rating" type="radio" id={`inline-radio-2`} onChange={handleChange}/>
                            <Form.Check inline label="3" value="3"name="rating" type="radio" id={`inline-radio-3`} onChange={handleChange}/>
                            <Form.Check inline label="4" value="4"name="rating" type="radio" id={`inline-radio-4`} onChange={handleChange}/>
                            <Form.Check inline label="5" value="5"name="rating" type="radio" id={`inline-radio-5`} onChange={handleChange}/>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formReviewContent">
                        <Form.FloatingLabel controlId="floatingInput" label="Your thoughts...">
                            <Form.Control as="textarea" placeholder="Review" style={{ height: '100px' }} name="content" onChange={handleChange} />
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