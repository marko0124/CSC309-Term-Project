import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Alert, Card, Form, InputGroup } from "react-bootstrap";
import apiClient from "../../../api/client";
import { useAuth } from "../../../context/authContext";
import HomeNavbar from "../../navbar/HomeNavbar";


const ProcessRedemptionPage = () => {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(null);
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
        <div className='profile-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />

            {/* Header Section */}
            <div className='header-container'>
                <div className='header-text'>
                    <h1>Process a Redemption</h1>
                    <div className='header-text-details'>

                    </div>
                    <div className='expandable-text'>
                        <p className='header-text-description'>
                            Process a user's redemption request
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
                <div className="info-card">
                    {errorMessage &&
                        <Alert variant="danger">
                            <Alert.Heading>Error.</Alert.Heading>
                            <p>Transaction ID, {formValues.transactionId}, is invalid</p>
                        </Alert>
                    }
                    <Form onSubmit={handleSubmit}>
                        <h3>Process Redemption Request</h3>
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
                </div>
            </section>

            <div className='footer' style={{ bottom: 0, position: "fixed", width: "100%" }}>Footer</div>
        </div>
    </>
}

export default ProcessRedemptionPage;