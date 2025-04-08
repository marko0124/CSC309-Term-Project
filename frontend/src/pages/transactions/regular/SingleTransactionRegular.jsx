import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import TransactionItemExpanded from "../components/TransactionItemExpanded";
import { useAuth } from "../../../context/authContext";
import apiClient from "../../../api/client";


const SingleTransactionRegular = () => {
    const { transactionId } = useParams();
    const [data, setData] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    const url = `transactions/${transactionId}`
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(url, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [transactionId]);

    if (data.id) {
        return <>
            <header>header</header>
            <nav>Nav bar</nav>
            <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem', justifyContent: 'center' }}>
                <section style={{ display: 'flex', flexDirection: 'column', width: '50rem' }}>
                    <div>
                        <h3>Transaction #{transactionId}</h3>
                        <TransactionItemExpanded transaction={data} />
                    </div>
                </section>
            </section>


            <footer>footer</footer>
        </>
    }

    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ display: 'flex', padding: '1rem 10rem', gap: '2rem', justifyContent: 'center' }}>
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

export default SingleTransactionRegular;