import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AdjustmentTransactionCreator = ({ setAmount, setRemark, onClick }) => {

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
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
        <InputGroup>
            <InputGroup.Text>Comments</InputGroup.Text>
            <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
        </InputGroup>

        <Button variant="primary" onClick={onClick}>create adjustment</Button>
    </>
}

export default AdjustmentTransactionCreator;