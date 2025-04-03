import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import TransactionsList from './components/transactionsList';
import TransactionsFilters from './components/transactionFilters';
import { useSearchParams } from 'react-router-dom';

const ManagerTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // const query = {
    //     name: searchParams.get("name") || null,
    //     createdBy: searchParams.get("createdBy") || null,
    //     suspicious: searchParams.get("suspicious") || null,
    //     promotionId: searchParams.get("promotionId") || null, 
    //     type: searchParams.get("type") || null,
    //     relatedId: searchParams.get("relatedId") || null,
    //     amount: searchParams.get("amount") || null, 
    //     operator: searchParams.get("operator") || null, 
    //     page: searchParams.get("page") || null,
    //     limit: searchParams.get("limit") || null,
    // };

    return <>
        <div>ManagerTransactions</div>
        <TransactionsList searchParamsString={searchParams.toString()}/>
        <TransactionsFilters setSearchParams={setSearchParams}/>
    </>
}

export default ManagerTransactions;