import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { capitalize } from '../../../utils/stringUtils';
import { Link } from "react-router-dom";

const TransactionItem = ({ transaction }) => {
    console.log(transaction.suspicious);
    if (transaction.type === "purchase") {
        return <>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
        >
            <div className="ms-2 me-auto">
            <div className="fw-bold">{capitalize(transaction.type)}</div>
            <Link to={`/transactions/${transaction.id}`}>go to transaction</Link>
            UTORID: {transaction.utorid}_
            AMOUNT: {transaction.amount}_
            SUSPICIOUS: {transaction.suspicious ? 'true' : 'false'}_
            CREATEDBY: {transaction.createdBy}_
            PROMO_IDS: {transaction.promotionIds}
            </div>
            <Badge bg="primary" pill>
            placeholder
            </Badge>
        </ListGroup.Item>
        </>
    }
    else if (transaction.type === "adjustment") {}
}

export default TransactionItem;