import ListGroup from 'react-bootstrap/ListGroup';
import { capitalize } from '../../../utils/stringUtils';
import { Link } from "react-router-dom";

const TransactionItem = ({ transaction, view }) => {

    const backgroundColor = transaction.type === "purchase" ? '#E15D44'
                            : transaction.type === "transfer" ? '#D65076' 
                            : transaction.type === "redemption" ? '#00A591' 
                            : transaction.type === "adjustment" ? '#FFD662'
                            : transaction.type === "event" ? '#6F9FD8' : '#000000'

    const url = view === "manager" ? `/transactions/manage/${transaction.id}` : `/transactions/${transaction.id}`

    return <>
        <Link to={url} style={{ textDecoration: 'none' }}>
            <ListGroup.Item
                style={{ padding: '2rem', width: '50rem', flexDirection: 'column', borderRadius: '1rem'}}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    {/* badge */}
                    <div style={{ padding: '0.2rem 0.8rem', backgroundColor: backgroundColor, borderRadius: '1rem', color: 'white' }}>
                        {capitalize(transaction.type)}
                    </div>
                    
                    {/* edit button */}
                    {/* { view === "manager" && 
                        <Link to={`/transactions/manage/${transaction.id}`}
                                style={ {textDecoration: 'none', color:'black', } } 
                        >
                            <Button variant='outline-primary' style={{ fontSize: '0.8rem', backgroundColor: '' }}>Edit Transaction</Button>
                        </Link> 
                    } */}
                </div>
                
                {/* body of card */}
                <div style={{ display:'flex', flexDirection: 'row', width: '100%', paddingLeft: '0.5rem'}}>

                    { transaction.type === "purchase" &&
                        <div style={{ flex: 2  }}>
                            <p><b>Spent:</b> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(transaction.spent)}</p>
                            <p><b>Points Earned:</b> {transaction.amount}</p>
                            {transaction.promotionIds.length > 0 && <p><b>Promotions used (IDs):</b> {transaction.promotionIds}</p> }
                        </div>
                    }

                    { transaction.type === "transfer" &&
                        <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <p><b>Sender:</b> {transaction.sender} </p>
                            <p><b>Recipient:</b> {transaction.recipient}</p>
                        </div>
                        </div>
                    }

                    { transaction.type === "redemption" &&
                        <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        </div>
                    }

                    { transaction.type === "adjustment" &&
                        <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        </div>
                    }

                    { transaction.type === "event" &&
                        <div style={{ flex: 2  }}>
                        <p><b>Points Earned:</b> {transaction.amount}</p>
                        </div>
                    }

                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>

                </div>

            </ListGroup.Item>
        </Link>
    </>
}

export default TransactionItem;