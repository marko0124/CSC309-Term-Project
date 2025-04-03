import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";

const TransactionsList = ({searchParamsString}) => {
    const [data, setData] = useState([]);
    const { token } = useContext(UserContext);
    useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}transactions?${searchParamsString}`, {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token
                    })
                });
                if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                }
                
                const json = await res.json();
                setData(json);
            }
            fetchData();

        } catch (error) {
            console.error(error);
        }
    }, [searchParamsString]);

    console.log(data.results);
    if (data.results) {
        const transactionsList = data.results.map((transaction) => {
            <li key={transaction.id}>
                {/* todo */}
            </li>
        });
    }
    return <>
        <div>Transactions List</div>
    </>
}

export default TransactionsList;