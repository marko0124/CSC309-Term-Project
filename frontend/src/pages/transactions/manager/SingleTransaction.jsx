import { useContext, useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { UserContext } from "../../../context/userContext";
import AdjustmentTransactionCreator from "../components/AdjustmentTransactionCreator";
import TransactionItemExpanded from "../components/TransactionItemExpanded";
import { Card } from "react-bootstrap";

const SingleTransaction = () => {
    const { transactionId } = useParams();
    const [data, setData] = useState({});
    const { token } = useContext(UserContext);
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const navigate = useNavigate();

    const handleSetSuspicious = () => {
        try {
            const patchData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions/${transactionId}/suspicious`, {
                    method: 'PATCH',
                    body: JSON.stringify({ suspicious: true }),
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return <>
                        {res.status}
                    </>
                }
                
                const json = await res.json();
                setData(json);
            }
            patchData();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleSetValid = () => {
        try {
            const patchData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions/${transactionId}/suspicious`, {
                    method: 'PATCH',
                    body: JSON.stringify({ suspicious: false }),
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return <>
                        {res.status}
                    </>
                }
                
                const json = await res.json();
                setData(json);
            }
            patchData();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleCreateAdjustment = () => {
        try {
            const createData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        utorid: data.utorid,
                        type: "adjustment",
                        amount: amount,
                        relatedId: data.id,
                        promotionIds: data.promotionIds || null,
                        remark: remark,
                    }),
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return <>
                        {res.status}
                    </>
                }
                
                const json = await res.json();
                navigate(`/transactions/${json.id}`);
            }
            createData();
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions/${transactionId}`, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return <>
                        {res.status}
                    </>
                }
                
                const json = await res.json();
                setData(json);
            }
            fetchData();

        } catch (error) {
            console.error(error);
        }
    }, [transactionId]);

    if (data.id) {
        return <>
            <header>header</header>
            <nav>Nav bar</nav>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                <h3>Transaction #{transactionId}</h3>
                    <TransactionItemExpanded transaction={data}/>
                </section>
    
                <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column'}}>
                    <h3>Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 'fit-content'}}>
                        <Card>
                            <Card.Header as="h5">Adjust Transaction Amount</Card.Header>
                            <Card.Body>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around' }}>
                                    <Button variant="success" onClick={handleSetValid}>Set Valid</Button>
                                    <Button variant="danger" onClick={handleSetSuspicious}>Set Suspicious</Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <AdjustmentTransactionCreator setAmount={setAmount} setRemark={setRemark} onClick={handleCreateAdjustment}/>

                    </div>
                </section>
            </section>


            <footer>footer</footer>
        </>
    }

    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
            <h3>Transaction #{transactionId}</h3>
                loading...
            </section>

            <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column'}}>
            <h3>Actions</h3>
            </section>
        </section>
        <footer>footer</footer>
    </>
}

export default SingleTransaction;