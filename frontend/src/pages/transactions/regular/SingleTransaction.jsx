import { useContext, useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import TransactionItemExpanded from "../components/TransactionItemExpanded";


const SingleTransaction = () => {
    const { transactionId } = useParams();
    const [data, setData] = useState({});
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

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
            <header>header</header>
            <nav>Nav bar</nav>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem', justifyContent: 'center'}}>
                <section style={{ display: 'flex', flexDirection: 'column', width: '50rem' }}>
                    <div>
                        <h3>Transaction #{transactionId}</h3>
                        <TransactionItemExpanded transaction={data}/>
                    </div>
                </section>
            </section>


            <footer>footer</footer>
        </>
    }

    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem', justifyContent: 'center'}}>
            <section style={{ display: 'flex', flexDirection: 'column', width: '50rem' }}>
                <div>
                    <h3>Transaction #{transactionId}</h3>
                        loading...
                </div>
            </section>
        </section>
        <footer>footer</footer>
    </>
}

export default SingleTransaction;