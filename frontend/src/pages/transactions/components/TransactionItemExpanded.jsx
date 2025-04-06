import { Card } from "react-bootstrap"
import { capitalize } from "../../../utils/stringUtils"
import Badge from 'react-bootstrap/Badge';

const TransactionItemExpanded = ({ transaction }) => {
    if (transaction.type === "purchase") {
        return <>
            <Card>
                <Card.Header as="h5" style={{ backgroundColor: '#E15D44', color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
                <Card.Body>
                    <Card.Title className="mb-3">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span><b>Authorizer:</b> {transaction.createdBy}</span>
                            { transaction.suspicious && <Badge bg="danger">Suspicious</Badge> }
                            { !transaction.suspicious && <Badge bg="success">Valid</Badge> }
                        </div>
                    </Card.Title>
                    <div style={{ display:'flex', flexDirection: 'row', width: '100%'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>User:</b> {transaction.utorid}</p>
                        <p><b>User:</b> {transaction.utorid}</p>
                        <p><b>Spent:</b> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(transaction.spent)}</p>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        <p><b>Promotions used (IDs):</b> [ {transaction.promotionIds} ]</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    }
    if (transaction.type === "transfer") {
        return <>
            <Card>
                <Card.Header as="h5" style={{ backgroundColor: '#D65076', color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    }
    if (transaction.type === "redemption") {
        return <>
            <Card>
                <Card.Header as="h5" style={{ backgroundColor: '#00A591', color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    }
    if (transaction.type === "adjustment") {
        return <>
            <Card>
                <Card.Header as="h5" style={{ backgroundColor: '#FFD662', color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    }
    if (transaction.type === "event") {
        return <>
            <Card>
                <Card.Header as="h5" style={{ backgroundColor: '#6F9FD8', color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    }
}

export default TransactionItemExpanded;