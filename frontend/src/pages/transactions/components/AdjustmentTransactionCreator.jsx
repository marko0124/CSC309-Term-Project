import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const AdjustmentTransactionCreator = ({ setAmount, setRemark, onClick }) => {

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }

    const onChangeRemark = (e) => {
        setRemark(e.target.value);
    }

    return <>
        <Card>
            <Card.Header as="h5">Adjust Transaction Amount</Card.Header>
            <Card.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="amount">Amount</InputGroup.Text>
                    <Form.Control
                        placeholder="Enter number of points"
                        aria-label="Amount"
                        aria-describedby="amount"
                        onChange={onChangeAmount}
                    />
                </InputGroup>
                <InputGroup className='mb-3'>
                    <InputGroup.Text>Comments</InputGroup.Text>
                    <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
                </InputGroup>
            </Card.Body>
            <Card.Footer style={{ display: 'flex', justifyContent: 'end' }}>
                <Button variant="primary" onClick={onClick}>Adjust</Button>
            </Card.Footer>
        </Card>
    </>
}

export default AdjustmentTransactionCreator;