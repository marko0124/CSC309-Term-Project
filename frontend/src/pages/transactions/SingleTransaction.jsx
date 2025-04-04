import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import {useNavigate, useParams} from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import AdjustmentTransactionCreator from "./components/AdjustmentTransactionCreator";

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
            <div>transaction</div>
            {JSON.stringify(data)}
            <Button variant="primary" onClick={handleSetSuspicious}>set suspicious</Button>
            <AdjustmentTransactionCreator setAmount={setAmount} setRemark={setRemark} onClick={handleCreateAdjustment}/>
        </>
    }

    return <>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </>
}

export default SingleTransaction;