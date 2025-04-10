import { Card } from "react-bootstrap"
import { capitalize } from "../../../utils/stringUtils"
import Badge from 'react-bootstrap/Badge';
import { QRCodeSVG } from "qrcode.react";

const TransactionItemExpanded = ({ transaction, view }) => {

    const backgroundColor = transaction.type === "purchase" ? '#E15D44'
        : transaction.type === "transfer" ? '#D65076'
            : transaction.type === "redemption" ? '#00A591'
                : transaction.type === "adjustment" ? '#FFD662'
                    : transaction.type === "event" ? '#6F9FD8' : '#000000'
    return <>
        <Card>
            <Card.Header as="h5" style={{ backgroundColor: backgroundColor, color: 'white' }}>{capitalize(transaction.type)}</Card.Header>
            <Card.Body>
                <Card.Title className="mb-3">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {transaction.type === "purchase" && <span><b>Authorizer:</b> {transaction.createdBy}</span>}
                        {transaction.type === "transfer" &&
                            <>
                                {transaction.amount >= 0 && <p className="mb-0"><b>Recipient:</b> {transaction.recipient}</p>}
                                {transaction.amount < 0 && <p className="mb-0"><b>Sender:</b> {transaction.sender}</p>}
                            </>
                        }
                        {transaction.type === "redemption" && <span><b>User:</b> {transaction.createdBy}</span>}
                        {transaction.type === "adjustment" && <span><b>Authorizer:</b> {transaction.createdBy}</span>}
                        {transaction.type === "event" && <span><b>Authorizer:</b> {transaction.createdBy}</span>}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {transaction.type === "redemption" && !transaction.relatedId && <Badge bg="warning">Pending</Badge>}
                            {transaction.suspicious && view === "manager" && <Badge bg="danger">Suspicious</Badge>}
                            {!transaction.suspicious && view === "manager" && <Badge bg="success">Valid</Badge>}
                        </div>
                    </div>
                </Card.Title>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                    {transaction.type === "purchase" &&
                        <div style={{ flex: 2 }}>
                            <p><b>User:</b> {transaction.utorid}</p>
                            <p><b>Spent:</b> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(transaction.spent)}</p>
                            <p><b>Points Earned:</b> {transaction.amount}</p>
                            <p><b>Promotions used (IDs):</b> [ {transaction.promotionIds.join(' ')}]</p>
                        </div>
                    }

                    {transaction.type === "transfer" &&
                        <div style={{ flex: 2 }}>
                            {transaction.amount >= 0 && <p><b>Sender:</b> {transaction.sender}</p>}
                            {transaction.amount < 0 && <p><b>Recipient:</b> {transaction.recipient}</p>}
                            <p><b>Points Amount:</b> {transaction.amount}</p>
                        </div>
                    }

                    {transaction.type === "redemption" &&
                        <div style={{ flex: 2 }}>
                            <p><b>Points Earned:</b> {transaction.amount}</p>
                            <p><b>Authorizing Cashier ID:</b> {transaction.relatedId || 'n/a'}</p>

                            <QRCodeSVG
                                value={`${transaction.id}`}
                                size={150}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                            />
                        </div>
                    }

                    {transaction.type === "adjustment" &&
                        <div style={{ flex: 2 }}>
                            <p><b>User:</b> {transaction.utorid}</p>
                            <p><b>Points Adjusted:</b> {transaction.amount}</p>
                            <p><b>Promotions used (IDs):</b> [ {transaction.promotionIds} ]</p>
                            <p><b>Adjusted Transaction ID:</b> {transaction.relatedId || 'n/a'}</p>
                        </div>
                    }

                    {transaction.type === "event" &&
                        <div style={{ flex: 2 }}>
                            <p><b>User:</b> {transaction.utorid}</p>
                            <p><b>Points Earned:</b> {transaction.amount}</p>
                            <p><b>Event ID:</b> {transaction.relatedId || 'n/a'}</p>
                        </div>
                    }

                    <div style={{ flex: 1 }}>
                        <p><b>Remark:</b> {transaction.remark == null || transaction.remark === "" ? 'n/a' : transaction.remark}</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    </>

}

export default TransactionItemExpanded;