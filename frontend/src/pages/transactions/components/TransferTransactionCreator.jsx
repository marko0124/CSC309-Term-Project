import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const TransferTransactionCreator = ({ setAmount, setRemark, setRecipient, onClick }) => {

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
        <InputGroup>
            <InputGroup.Text>Comments</InputGroup.Text>
            <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
        </InputGroup>
        <Button variant="primary" onClick={onClick}>Transfer</Button>
    </>
}

export default TransferTransactionCreator;