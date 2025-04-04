import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import TransactionsList from './components/TransactionsList';
import TransactionsFilters from './components/TransactionFilters';
import { useSearchParams } from 'react-router-dom';

const ManagerTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    console.log(searchParams.toString())
    return <>
        <div>ManagerTransactions</div>
        <div className='p-3'>
            <TransactionsFilters setSearchParams={setSearchParams} privileged={true}/>
            <h3>Transactions List</h3>
            <TransactionsList searchParamsString={searchParams.toString()} priviliged={true}/>
        </div>
    </>
}

export default ManagerTransactions;