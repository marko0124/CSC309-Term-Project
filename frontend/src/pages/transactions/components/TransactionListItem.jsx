import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { capitalize } from '../../../utils/stringUtils';
import { Link } from "react-router-dom";

const TransactionItem = ({ transaction, view }) => {
    if (transaction.type === "purchase") {
        return <>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >

                { view === "manager" && <Link to={`/transactions/manage/${transaction.id}`}>go to transaction</Link> }

                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: '#E15D44', borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>Spent:</b> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(transaction.spent)}</p>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        {transaction.promotionIds.length > 0 && <p><b>Promotions used (IDs):</b> {transaction.promotionIds}</p> }
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>

            </ListGroup.Item>
        </>
    }
    else if (transaction.type === "transfer") {
        return <>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >

                { view === "manager" && <Link to={`/transactions/manage/${transaction.id}`}>go to transaction</Link> }
                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: '#D65076', borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <p><b>Sender:</b> {transaction.sender} </p>
                            <p><b>Recipient:</b> {transaction.recipient}</p>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>

            </ListGroup.Item>
        </>
    }
    else if (transaction.type === "redemption") {
        return <>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >

                { view === "manager" && <Link to={`/transactions/manage/${transaction.id}`}>go to transaction</Link> }
                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: '#00A591', borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>

            </ListGroup.Item>
        </>
    }
    else if (transaction.type === "adjustment") {
        return <>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                { view === "manager" && <Link to={`/transactions/manage/${transaction.id}`}>go to transaction</Link> }
                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: '#FFD662', borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>

            </ListGroup.Item>
        </>
    }
    else if (transaction.type === "event") {
        return <>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >

                { view === "manager" && <Link to={`/transactions/manage/${transaction.id}`}>go to transaction</Link> }
                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: '#6F9FD8', borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>
                    <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>

            </ListGroup.Item>
        </>
    }
    return <>weird</>
}

export default TransactionItem;