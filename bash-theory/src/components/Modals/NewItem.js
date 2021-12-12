import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ItemModal(){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const modal = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create New Item
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formItemName">
                        <Form.FloatingLabel controlId="floatingInput" label="Name of New Item" classname="mb-3">
                            <Form.Control type="text" placeholder="Name of New Item" />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formItemType">
                        <Form.FloatingLabel controlId="floatingInput" label="Item Type" classname="mb-3">
                            <Form.Select aria-label="item type select">
                                <option key="blankChoice" hidden value>Select item type...</option>
                                <option key="building" value="building">Building</option>
                                <option key="professor" value="professor">Professor</option>
                                <option key="eatingSpot" value="eatingSpot">Eating Spot</option>
                                <option key="class" value="class">Class</option>
                            </Form.Select>
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formItemImg">
                        <Form.FloatingLabel controlId="floatingInput" label="Image URL or Raw Image" classname="mb-3">
                            <Form.Control type="text" placeholder="Image URL" />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId="formItemDesc">
                        <Form.FloatingLabel controlId="floatingInput" label="Description...">
                            <Form.Control as="textarea" placeholder="Description" style={{ height: '100px' }} />
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button type="submit">Submit</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            <Button onClick={handleShow}>
                Add New Item
            </Button>

            {modal}
        </>
    );
}

export default ItemModal;