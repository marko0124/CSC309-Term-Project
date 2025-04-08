import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Alert, Card, Form, InputGroup } from "react-bootstrap";
import apiClient from "../../../api/client";
import { useAuth } from "../../../context/authContext";


const ProcessRedemptionPage = () => {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const entries = Object.fromEntries(data.entries().filter(([_, value]) => value !== ""));
        entries.processed = true;
        console.log(entries);
        setFormValues(entries);
        return false;
    }

    useEffect(() => {
        // do this to prevent useEffect from running on component mount
        if (!formValues.processed) {
            return;
        }

        const patchData = async () => {
            try {
                const response = await apiClient.patch(
                    `transactions/${formValues.transactionId}/processed`,
                    formValues,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setErrorMessage(null);
                navigate(`/transactions/${response.data.id}`);
            } catch (error) {
                if (error.response && error.response.data) {
                    const { error: errorMsg } = error.response.data;
                    setErrorMessage(errorMsg);
                } else {
                    console.error(error);
                    setErrorMessage("An unexpected error occurred.");
                }
            }
        }
        patchData();
    }, [formValues]);


    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>

                <Card>
                    <Card.Header style={{ fontSize: '2rem' }}>Process a Redemption Request</Card.Header>
                    <Card.Body>
                        {errorMessage &&
                            <Alert variant="danger" dismissible>
                                <Alert.Heading>Error.</Alert.Heading>
                                <p>Transaction ID, {formValues.transactionId}, is invalid</p>
                            </Alert>
                        }
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Transaction ID</InputGroup.Text>
                                <Form.Control
                                    placeholder="Enter transaction ID"
                                    aria-label="transactionId"
                                    aria-describedby="transactionId"
                                    name="transactionId"
                                />
                            </InputGroup>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit">Process</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

            </section>
        </section>

        <footer>footer</footer>
    </>

}

export default ProcessRedemptionPage;