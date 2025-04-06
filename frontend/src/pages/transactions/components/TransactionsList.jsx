import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import TransactionItem from "./TransactionListItem";
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import PaginationButtons from "./PaginationButtons";

const TransactionsList = ({ searchParamsString, view, showPagination, searchParams, setSearchParams }) => {
    const [data, setData] = useState({ count: 0, results: [] });
    const { token } = useContext(UserContext);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        try {
            setData([]);

            const url = view === "manager" ? `${process.env.REACT_APP_BASE_URL}transactions?${searchParamsString}` 
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
    }, [searchParamsString, view]);

    console.log(data.results);
    console.log(data.count);
    if (data.results) {
        if (data.count === 0) {
            return <div>No results :(</div>
        }
        const transactionsList = data.results.map((transaction) => {
            return <li key={transaction.id}>
                <TransactionItem transaction={transaction} view={view}/>
            </li>
        });

        return <>
                <ListGroup as="ol" style={{ listStyleType: 'none', gap: '2rem', marginBottom: '1rem' }}>
                {transactionsList}
                </ListGroup>
                { showPagination && <PaginationButtons searchParams={searchParams} setSearchParams={setSearchParams} count={data.count} limit={limit} /> }
        </>
          
    }
    return <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    
}

export default TransactionsList;