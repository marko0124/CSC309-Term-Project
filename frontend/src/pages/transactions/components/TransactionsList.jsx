import { useEffect, useState } from "react";
import TransactionItem from "./TransactionListItem";
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import PaginationButtons from "./PaginationButtons";
import { useAuth } from "../../../context/authContext";
import apiClient from "../../../api/client";

const TransactionsList = ({ searchParamsString, view, showPagination, searchParams, setSearchParams }) => {
    const [data, setData] = useState({ count: 0, results: [] });
    const { user } = useAuth();
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        try {
            setData([]);

            const url = view === "manager" ? `transactions?${searchParamsString}` 
                : `users/me/transactions?${searchParamsString}`

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
                        setData({ count: 0, results: [] });
                    }
                };
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
            return <TransactionItem transaction={transaction} view={view} key={transaction.id}/>
            
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