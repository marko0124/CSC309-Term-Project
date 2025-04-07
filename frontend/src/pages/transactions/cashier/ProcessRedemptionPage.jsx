import { useContext, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { UserContext } from "../../../context/userContext";
import { Alert, Card, Form, InputGroup } from "react-bootstrap";


const ProcessRedemptionPage = () => {
    const { token } = useContext(UserContext);
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
        
        try {
            const patchData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions/${formValues.transactionId}/processed`, {
                    method: 'PATCH',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(formValues),
                });
                if (!res.ok) {
                    const { error } = await res.json();
                    return setErrorMessage(error);
                }
                
                const json = await res.json();
                setErrorMessage(null);
                navigate(`/transactions/${json.id}`);
            }
            patchData();

        } catch (error) {
            console.error(error);
        }
    }, [formValues]);


        return <>
            <header>header</header>
            <nav>Nav bar</nav>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                    
                    <Card>
                        <Card.Header style={{ fontSize: '2rem' }}>Process a Redemption Request</Card.Header>
                        <Card.Body>
                        { errorMessage && 
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
                                <Button variant="primary" type="submit">Create</Button>
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