import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const PurchaseTransactionCreator = ({ setUtorid, setAmount, setPromotionIds, setRemark, onClick }) => {

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }

    const onChangeUtorid = (e) => {
        setUtorid(e.target.value);
    }

    const onChangePromotionIds = (e) => {
        const promotionIds = e.target.value.split(',').map((val) => {
            return parseInt(val);
        })
        setPromotionIds(promotionIds);
    }

    const onChangeRemark = (e) => {
        setRemark(e.target.value);
    }

    return <>
        <InputGroup className="mb-3">
            <InputGroup.Text id="utorid">User</InputGroup.Text>
                <Form.Control
                    placeholder="Enter utorid"
                    aria-label="utorid"
                    aria-describedby="utorid"
                    onChange={onChangeUtorid}
                />
            <InputGroup.Text id="amount">Amount</InputGroup.Text>
            <Form.Control
                placeholder="Enter number of points to spend"
                aria-label="Amount"
                aria-describedby="amount"
                onChange={onChangeAmount}
            />
            <Form.Control
                placeholder="Enter ids of promotions to apply (comma separated)"
                aria-label="promotionIds"
                aria-describedby="promotionIds"
                onChange={onChangePromotionIds}
            />
        </InputGroup>
        <InputGroup>
            <InputGroup.Text>Comments</InputGroup.Text>
            <Form.Control as="textarea" aria-label="With textarea" onChange={onChangeRemark}/>
        </InputGroup>

        <Button variant="primary" onClick={onClick}>redeem</Button>
    </>
}

export default PurchaseTransactionCreator;