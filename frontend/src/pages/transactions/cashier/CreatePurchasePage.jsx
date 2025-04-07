import { useContext, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { UserContext } from "../../../context/userContext";
import { Card, Form, InputGroup } from "react-bootstrap";


const CreatePurchasePage = () => {
    const { token } = useContext(UserContext);
    const [formValues, setFormValues] = useState({});
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
        
        try {
            const createData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions`, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(formValues),
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
    }, [formValues]);


        return <>
            <header>header</header>
            <nav>Nav bar</nav>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                    
                    <Card>
                        <Card.Header style={{ fontSize: '2rem' }}>Create a Purchase</Card.Header>
                        <Card.Body>
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
                        </Card.Body>
                    </Card>

                </section>
            </section>


            <footer>footer</footer>
        </>
    
}

export default CreatePurchasePage;