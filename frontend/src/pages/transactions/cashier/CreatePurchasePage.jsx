import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { Alert, Card, Form, InputGroup } from "react-bootstrap";
import apiClient from "../../../api/client";
import { useAuth } from "../../../context/authContext";
import HomeNavbar from "../../navbar/HomeNavbar";

const CreatePurchasePage = () => {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const entries = Object.fromEntries(data.entries().filter(([_, value]) => value !== ""));
        entries.type = "purchase"
        entries.promotionIds = entries.promotionIds?.split(',').map((id) => parseInt(id)) || [];
        console.log(entries);
        setFormValues(entries);
        return false;
    }

    useEffect(() => {
        // do this to prevent useEffect from running on component mount
        if (formValues.type !== "purchase") {
            return;
        }
        const createData = async () => {
            try {
                const response = await apiClient.post(
                    'transactions',
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
                if (error.response && error.response.data) {
                    const { error: errorMsg } = error.response.data;
                    setErrorMessage(errorMsg);
                } else {
                    console.error(error);
                    setErrorMessage("An unexpected error occurred.");
                }
            }
        }
        createData();
    }, [formValues]);

    return <>
        <div className='profile-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />

            {/* Header Section */}
            <div className='header-container'>
                <div className='header-text'>
                    <h1>Purchase Transaction</h1>
                    <div className='header-text-details'>

                    </div>
                    <div className='expandable-text'>
                        <p className='header-text-description'>
                            Create a purchase transaction
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
                <div className="info-card" style={{ width: '50%' }}>
                    {errorMessage &&
                        <Alert variant="danger" dismissible>
                            <Alert.Heading>Error.</Alert.Heading>
                            <p>{errorMessage}</p>
                        </Alert>
                    }
                    <h3>Create a Purchase</h3>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">User</InputGroup.Text>
                            <Form.Control
                                placeholder="Enter utorid"
                                aria-label="utorid"
                                aria-describedby="utorid"
                                name="utorid"
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Amount</InputGroup.Text>
                            <Form.Control
                                aria-label="Amount (to the nearest dollar)"
                                placeholder="Enter amount spent"
                                name="spent"
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Promotion IDs</InputGroup.Text>
                            <Form.Control
                                aria-label="Amount (to the nearest dollar)"
                                placeholder='Enter any promotions to apply (comma separated, no spaces, i.e., "1,2,3")'
                                name="promotionIds"
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
                            <Button variant="primary" type="submit">Create</Button>
                        </div>
                    </Form>
                </div>
            </section>

            <div className='footer'>Footer</div>
        </div>
    </>

}

export default CreatePurchasePage;