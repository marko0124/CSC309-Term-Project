import { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const RedemptionTransactionCreator = ({ setAmount, setRemark, onClick }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }

    const onChangeRemark = (e) => {
        setRemark(e.target.value);
    }

    return <>
        <Button variant="primary" onClick={handleShow}>
            Redeem Points
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Redeem Points</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="amount">Amount</InputGroup.Text>
                    <Form.Control
                        placeholder="Enter number of points to redeem"
                        aria-label="Amount"
                        aria-describedby="amount"
                        onChange={onChangeAmount}
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text>Comments</InputGroup.Text>
                    <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
                </InputGroup>

            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={onClick}>Redeem</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default RedemptionTransactionCreator;