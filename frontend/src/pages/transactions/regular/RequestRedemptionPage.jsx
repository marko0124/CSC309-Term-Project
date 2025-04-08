import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Card, Form, InputGroup } from "react-bootstrap";
import apiClient from "../../../api/client";
import { useAuth } from "../../../context/authContext";

const RequestRedemptionPage = () => {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const entries = Object.fromEntries(data.entries().filter(([_, value]) => value !== ""));
        entries.type = "redemption"
        console.log(entries);
        setFormValues(entries);
        return false;
    }

    useEffect(() => {
        // do this to prevent useEffect from running on component mount
        if (formValues.type !== "redemption") {
            return;
        }
        const createData = async () => {
            try {
                const response = await apiClient.post(
                    'users/me/transactions',
                    formValues,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
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
        createData();
    }, [formValues]);


    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>

                <Card>
                    <Card.Header style={{ fontSize: '2rem' }}>Redeem Points</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Amount</InputGroup.Text>
                                <Form.Control
                                    aria-label="amount"
                                    placeholder="Enter amount of points"
                                    name="amount"
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>Remark</InputGroup.Text>
                                <Form.Control
                                    as="textarea"
                                    aria-label="With textarea"
                                    name="remark"
                                />
                            </InputGroup>
                            <div className="d-flex justify-content-end">
                                <Button variant="primary" type="submit">Redeem</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

            </section>
        </section>


        <footer>footer</footer>
    </>

}

export default RequestRedemptionPage;