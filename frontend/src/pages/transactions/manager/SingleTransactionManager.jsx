import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import TransactionItemExpanded from "../components/TransactionItemExpanded";
import { Form, InputGroup } from "react-bootstrap";
import { useAuth } from "../../../context/authContext";
import apiClient from "../../../api/client";
import HomeNavbar from "../../navbar/HomeNavbar";
import './SingleTransaction.css'
import Loading from "../../errors/Loading";

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
            setData({ ...data, suspicious: response.data.suspicious, amount: response.data.amount });
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
            setData({ ...data, suspicious: response.data.suspicious, amount: response.data.amount });
        } catch (error) {
            console.error("Error patching data:", error);
            return (
                <>
                    {error.response.status}
                </>
            );
        }
    }

    const handleAdjust = async () => {
        try {
            const response = await apiClient.post(
                'transactions',
                {
                    utorid: data.utorid || (data.type === "transfer" ? data.amount < 0 ? data.sender : data.recipient : null),
                    type: "adjustment",
                    amount: amount,
                    relatedId: data.id,
                    promotionIds: data.promotionIds || [],
                    remark: remark,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            navigate(`/transactions/manage/${response.data.id}`);
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
            <div className='profile-page'>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
                <HomeNavbar />

                {/* Header Section */}
                <div className='header-container'>
                    <div className='header-text'>
                        <h1>Manage Transaction</h1>
                        <div className='header-text-details'>

                        </div>
                        <div className='expandable-text'>
                            <p className='header-text-description'>
                                View and manage a transaction
                            </p>
                        </div>
                    </div>
                </div>

                <div className="custom-shape-divider-top-1743545933">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>

                {/* Main Content */}
                <section className="page-layout">
                    <div className="info-card d-flex flex-column transaction-expanded">

                        <h3>Transaction #{transactionId}</h3>
                        <TransactionItemExpanded transaction={data} view={"manager"}/>
                    </div>
                    <div className="info-card">
                        <div className="info-section">
                            <h3>Set status</h3>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around', marginBottom: '1rem' }}>
                                <Button variant={!data.suspicious ? "secondary" : "success"} onClick={handleSetValid} disabled={!data.suspicious}>Set Valid</Button>
                                <Button variant={data.suspicious ? "secondary" : "danger"} onClick={handleSetSuspicious} disabled={data.suspicious}>Set Suspicious</Button>
                            </div>
                            <div>
                                <h3>Adjust Transaction</h3>
                                <div>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="amount">Amount</InputGroup.Text>
                                        <Form.Control
                                            placeholder="Enter number of points"
                                            aria-label="Amount"
                                            aria-describedby="amount"
                                            onChange={(e) => { setAmount(e.target.value) }}
                                        />
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Text>Comments</InputGroup.Text>
                                        <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => { setRemark(e.target.value) }} />
                                    </InputGroup>
                                    <button onClick={handleAdjust} className="edit-button">Adjust</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <div className='footer'>Footer</div>
            </div>
        </>

    }

    return <Loading />
}

export default SingleTransactionManager;