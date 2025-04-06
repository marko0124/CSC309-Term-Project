import { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const TransferTransactionCreator = ({ setAmount, setRemark, setRecipient, onClick }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }

    const onChangeRecipient = (e) => {
        setRecipient(e.target.value);
    }

    const onChangeRemark = (e) => {
        setRemark(e.target.value);
    }

    return <>
        <Button variant="primary" onClick={handleShow}>
            Transfer Points
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Transfer Points</Modal.Title>
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
                <InputGroup.Text id="recipient">Recipient</InputGroup.Text>
                <Form.Control
                    placeholder="Enter recipient ID"
                    aria-label="recipient"
                    aria-describedby="recipient"
                    onChange={onChangeRecipient}
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
            <Button variant="primary" onClick={onClick}>Transfer</Button>
        </Modal.Footer>
        </Modal>
    </>
}

export default TransferTransactionCreator;