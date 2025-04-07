import { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const PurchaseTransactionCreator = ({ setAmount, setRemark, setUtorid, setPromotionIds, onClick }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }

    const onChangeUtorid = (e) => {
        setUtorid(e.target.value);
    }

    const onChangeRemark = (e) => {
        setRemark(e.target.value);
    }

    const onChangePromotionIds = (e) => {
        setPromotionIds(e.target.value);
    }

    return <>
        <Button variant="primary" onClick={handleShow}>
            Create a Purchase
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Create a Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup className="mb-3">
                <InputGroup.Text id="amount">Amount</InputGroup.Text>
                <Form.Control
                    placeholder="Enter number of points"
                    aria-label="Amount"
                    aria-describedby="amount"
                    onChange={onChangeAmount}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="recipient">UtorID</InputGroup.Text>
                <Form.Control
                    placeholder="Enter UtorID"
                    aria-label="utorid"
                    aria-describedby="utorid"
                    onChange={onChangeUtorid}
                />
            </InputGroup>
            <InputGroup className='mb-3'>
                <InputGroup.Text>Comments</InputGroup.Text>
                <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
            </InputGroup>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={onClick}>Create</Button>
        </Modal.Footer>
        </Modal>
    </>
}

export default PurchaseTransactionCreator;