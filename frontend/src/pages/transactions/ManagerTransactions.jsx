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
        <div className='p-3'>
            <TransactionsFilters setSearchParams={setSearchParams}/>
            <h3>Transactions List</h3>
            <TransactionsList searchParamsString={searchParams.toString()}/>
        </div>
    </>
}

export default ManagerTransactions;