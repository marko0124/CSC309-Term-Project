import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { UserContext } from "../../../context/userContext";
import AdjustmentTransactionCreator from "../components/AdjustmentTransactionCreator";
import TransactionItemExpanded from "../components/TransactionItemExpanded";
import { Card } from "react-bootstrap";
import { useAuth } from "../../../context/authContext";
import apiClient from "../../../api/client";

const SingleTransactionManager = () => {
    const { transactionId } = useParams();
    const [data, setData] = useState({});
    const { user } = useAuth();
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const navigate = useNavigate();

    const handleSetSuspicious = async () => {
        try {
            const response = await apiClient.patch(
                `transactions/${transactionId}/suspicious`,
                { suspicious: true },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setData(response.data);
        } catch (error) {


            console.error("Error patching data:", error);
            return (
                <>
                    {error.response.status}
                </>
            );
        }
    }

    const handleSetValid = async () => {
        try {
            const response = await apiClient.patch(
                `transactions/${transactionId}/suspicious`,
                { suspicious: false },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setData(response.data);
        } catch (error) {
            console.error("Error patching data:", error);
            return (
                <>
                    {error.response.status}
                </>
            );
        }
    }

    const handleCreateAdjustment = async () => {
        try {
            const response = await apiClient.post(
                'transactions',
                {
                    utorid: data.utorid,
                    type: "adjustment",
                    amount: amount,
                    relatedId: data.id,
                    promotionIds: data.promotionIds || null,
                    remark: remark,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            navigate(`/transactions/${response.data.id}`);
        } catch (error) {
            console.error(error);
            return (
                <>
                    {error.response.status}
                </>
            );
        }
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                try {
                    const response = await apiClient.get(`transactions/${transactionId}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    setData(response.data);
                } catch (error) {
                    console.error(error);
                    return (
                        <>
                            {error.response.status}
                        </>
                    );
                }
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
            <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                    <h3>Transaction #{transactionId}</h3>
                    <TransactionItemExpanded transaction={data} />
                </section>

                <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column' }}>
                    <h3>Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 'fit-content' }}>
                        <Card>
                            <Card.Header as="h5">Adjust Transaction Amount</Card.Header>
                            <Card.Body>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around' }}>
                                    <Button variant="success" onClick={handleSetValid}>Set Valid</Button>
                                    <Button variant="danger" onClick={handleSetSuspicious}>Set Suspicious</Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <AdjustmentTransactionCreator setAmount={setAmount} setRemark={setRemark} onClick={handleCreateAdjustment} />

                    </div>
                </section>
            </section>


            <footer>footer</footer>
        </>
    }

    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                <h3>Transaction #{transactionId}</h3>
                loading...
            </section>

            <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column' }}>
                <h3>Actions</h3>
            </section>
        </section>
        <footer>footer</footer>
    </>
}

export default SingleTransactionManager;