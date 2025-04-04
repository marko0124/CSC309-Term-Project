import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import TransactionItem from "./transactionItem";
import Table from 'react-bootstrap/Table';

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
            return <tr key={transaction.id}>
                <TransactionItem transaction={transaction}/>
            </tr>
        });

        return <div className="p-3">
            <h3>Transactions List</h3>
            <Table striped>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>utorid</th>
                    <th>amount</th>
                    <th>type</th>
                    <th>spent</th>
                    <th>relatedId</th>
                    <th>promotionIds</th>
                    <th>suspicious</th>
                    <th>remark</th>
                    <th>createdBy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr></tr>
                    {transactionsList}
                </tbody>
            </Table>
        </div>
    }
}

export default TransactionsList;