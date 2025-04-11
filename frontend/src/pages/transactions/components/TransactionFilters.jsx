import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const TransactionsFilters = ({ searchParams, setSearchParams, view }) => {
    const [name, setName] = useState(searchParams.get('name'));
    const [createdBy, setCreatedBy] = useState(searchParams.get('createdBy'));
    const [amount, setAmount] = useState(searchParams.get('amount'));
    const [type, setType] = useState(searchParams.get('type') || '');
    const [relatedId, setRelatedId] = useState(searchParams.get('relatedId'));
    const [promotionId, setPromotionId] = useState(searchParams.get('promotionId'));
    const [operator, setOperator] = useState(searchParams.get('operator'));
    const [suspicious, setSuspicious] = useState(searchParams.get('suspicious') === "true");

    useEffect(() => {
        if (type === "") {
            setRelatedId("");
        }
    }, [type]);

    const handleApply = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const entries = Object.fromEntries(data.entries().filter(([_, value]) => value !== ""));
        setSearchParams(entries);
        return false;
    }

    return (
        <Form className='p-3' onSubmit={handleApply} action='/'>
            {view === "manager" &&
                <>
                    <Form.Group className="mb-3" controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="name/utorid" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupCreatedBy">
                        <Form.Label>Created By</Form.Label>
                        <Form.Control type="text" placeholder="utorid" name='createdBy' value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}/>
                    </Form.Group>
                </>
            }
            <Row>
                <Col>
                    <h6>Type</h6>
                    <Form.Select aria-label="type" className='mb-3' name='type' value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Any</option>
                        <option value="purchase">Purchase</option>
                        <option value="adjustment">Adjustment</option>
                        <option value="redemption">Redemption</option>
                        <option value="transfer">Transfer</option>
                    </Form.Select>
                </Col>
                <Col>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <h6>Related ID</h6>
                        <OverlayTrigger
                            placement={'top'}
                            overlay={
                                <Popover>
                                    <Popover.Header as="h3">What is the Related ID?</Popover.Header>
                                    <Popover.Body>
                                        <p className='mb-0'>
                                            <strong>Adjustment:</strong> the ID of the transaction for which the adjustment is being made to.
                                        </p>
                                        <p className='mb-0'>
                                            <strong>Transfer:</strong> the ID of the other user, i.e., for the sender's transaction, relatedId is the ID of the receiver; for the receiver's transaction, relatedId is the ID of the sender.
                                        </p>
                                        <p className='mb-0'>
                                            <strong>Redemption:</strong> the user ID of the cashier who processed the redemption -- can be null if the redemption has not been processed yet.
                                        </p>
                                        <p className='mb-0'>
                                            <strong>Event:</strong> the ID of the event from which points were disbursed.
                                        </p>
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <h6 style={{ backgroundColor: '#292f63', color: 'white', borderRadius: '50%', width: '1rem', textAlign:'center', height: '1rem' }}>?</h6>
                        </OverlayTrigger>
                    </div>
                    <Form.Control
                        type="text"
                        placeholder={type === "" ? "Must select type" : "relatedId"}
                        value={relatedId}
                        onChange={(e) => setRelatedId(e.target.value)}
                        aria-label="relatedId"
                        name='relatedId'
                        disabled={type === ""}
                        readOnly={type === ""}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formGroupAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" placeholder="amount"  value={amount} onChange={(e) => setAmount(e.target.value)} name="amount" />
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
                                checked={operator === 'lte'}
                                onChange={() => setOperator('lte')}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="gte"
                                value="gte"
                                label="Greater than"
                                name="operator"
                                checked={operator === 'gte'}
                                onChange={() => setOperator('gte')}
                            />
                        </>
                    )}
                </Col>
            </Row>
            <Row>
                <Form.Group className="mb-3" controlId="formGroupAmount">
                    <Form.Label>Promotion ID Used</Form.Label>
                    <Form.Control type="text" placeholder="promotionId" name='promotionId' value={promotionId} onChange={(e) => setPromotionId(e.target.value)}/>
                </Form.Group>
            </Row>
            {view === "manager" &&
                <>
                    <Row>
                        <Form.Check className='ms-3 mb-3'
                            type="checkbox"
                            id="suspicious"
                            label="Suspicious"
                            name='suspicious'
                            value="true"
                            checked={suspicious}
                            onClick={() => setSuspicious(!suspicious)}
                        />
                    </Row>
                </>
            }
            <Button type="submit">Apply Filters</Button>
        </Form>
    );
}

export default TransactionsFilters;