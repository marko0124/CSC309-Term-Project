import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { useContext, useState } from "react";
import TransactionsList from "../components/TransactionsList";
import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";

const CashierTransactions = () => {
    const { token, role } = useContext(UserContext);
    const navigate = useNavigate();
    const [transferAmount, setTransferAmount] = useState("");
    const [transferRemark, setTransferRemark] = useState("");
    const [redeemAmount, setRedeemAmount] = useState("");
    const [redeemRemark, setRedeemRemark] = useState("");
    const [transferRecipientId, setTransferRecipientId] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTransfer = () => {
        try {
            const createData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}users/${transferRecipientId}/transactions`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        type: "transfer",
                        amount: transferAmount,
                        remark: transferRemark,
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
                navigate(`/transactions/manage/${json.id}`);
            }
            createData();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleRedeem = () => {
        try {
            const createData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}users/me/transactions`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        type: "redemption",
                        amount: redeemAmount,
                        remark: redeemRemark,
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
                navigate(`/transactions/manage/${json.id}`);
            }
            createData();
            
        } catch (error) {
            console.error(error);
        }
    }



    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ padding:'1rem 10rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '66vw', padding: '2rem', maxWidth: '50rem' }}>
                <Card.Body>
                    <Card.Title>Quick Actions</Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <Link to={'/transactions/cashier/create'}>
                            <Button>Create a Purchase</Button>
                        </Link>
                    </div>
                </Card.Body>
                </Card>
            </section>
            <section style={{ marginBottom: '5rem' }}/>
            <section style={{ display: 'flex', justifyContent: 'center'}}>
                <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'column', width: '50rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>My Recent Transactions</h3>
                        <Link to={"/transactions/all"}>
                            <Button variant="outline-primary">View All</Button>
                        </Link>

                    </div>
                    <div>
                        <TransactionsList 
                            searchParamsString={searchParams.toString()} 
                            view={"regular"} 
                            showPagination={false} 
                            searchParams={searchParams} 
                            setSearchParams={setSearchParams} 

                        />
                    </div>
                </div>
            </section>
        </section>

        <footer>footer</footer>
    </>
}

export default CashierTransactions;