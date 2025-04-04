import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import TransactionItem from "./TransactionItem";
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

const TransactionsList = ({ searchParamsString, priviliged }) => {
    const [data, setData] = useState({ count: 0, results: [] });
    const { token } = useContext(UserContext);
    useEffect(() => {
        try {
            setData([]);

            const url = priviliged ? `${process.env.REACT_APP_BASE_URL}transactions?${searchParamsString}` 
                : `${process.env.REACT_APP_BASE_URL}users/me/transactions?${searchParamsString}`

            const fetchData = async () => {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return setData({ count: 0, results: [] });
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
        if (data.count === 0) {
            return <div>No results :(</div>
        }
        const transactionsList = data.results.map((transaction) => {
            return <ol key={transaction.id}>
                <TransactionItem transaction={transaction}/>
            </ol>
        });

        return (
            <ListGroup as="ol" className="w-50">
              {transactionsList}
            </ListGroup>
          );
    }
    return <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    
}

export default TransactionsList;