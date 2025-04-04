import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const TransactionsFilters = ({ setSearchParams }) => {
    const handleApply = () => {
    }
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Any');
    const [relatedId, setRelatedId] = useState("");
    useEffect(() => {
        if (type === "Any") {
          setRelatedId("");
        }
      }, [type]);

    return (
        <Form className='p-3'>
            <h3>Filter by</h3>
            <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="name/utorid" name="name"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupCreatedBy">
                <Form.Label>Created By</Form.Label>
                <Form.Control type="text" placeholder="utorid" name='createdBy' />
            </Form.Group>
            <Row>
                <Col>
                    <h6>Type</h6>
                    <Form.Select aria-label="type" className='mb-3' name='type' value={type} onChange={(e) => setType(e.target.value)}>
                        <option>Any</option>
                        <option value="purchase">Purchase</option>
                        <option value="adjustment">Adjustment</option>
                        <option value="redemption">Redemption</option>
                        <option value="transfer">Transfer</option>
                    </Form.Select>
                </Col>
                <Col>
                    <h6>Related ID</h6>
                    <Form.Control
                        type="text"
                        placeholder={type === "Any" ? "Must select type" : "relatedId"}
                        value={relatedId}
                        onChange={(e) => setRelatedId(e.target.value)}
                        aria-label="relatedId"
                        name='relatedId'
                        disabled={type === "Any"}
                        readOnly={type === "Any"}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formGroupAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" placeholder="amount" onChange={(e) => setAmount(e.target.value)} name="amount"/>
                    </Form.Group>
                </Col>
                <Col>
                    {amount && (
                        <>
                            <h6 className='mb-3'>Show amounts</h6>
                            <Form.Check
                            inline
                            type="radio"
                            id="lte"
                            value="lte"
                            label="Less than"
                            name="operator"
                            />
                            <Form.Check
                            inline
                            type="radio"
                            id="gte"
                            value="gte"
                            label="Greater than"
                            name="operator"
                            />
                        </>
                    )}
                </Col>
            </Row>
            <Row>
                <Form.Group className="mb-3" controlId="formGroupAmount">
                    <Form.Label>Promotion ID Used</Form.Label>
                    <Form.Control type="text" placeholder="promotionId" name='promotionId'/>
                </Form.Group>
            </Row>
            <Row>
                <Form.Check className='ms-3'
                    type="checkbox"
                    id="suspicious"
                    label="Suspicious"
                    name='suspicious'
                    value="true"
                />
            </Row>

        </Form>
    );
}

export default TransactionsFilters;