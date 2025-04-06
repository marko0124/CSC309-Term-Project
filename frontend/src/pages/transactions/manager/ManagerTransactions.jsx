import React, { useContext } from 'react';
import { UserContext } from '../../../context/userContext';
import TransactionsList from '../components/TransactionsList';
import TransactionsFilters from '../components/TransactionFilters';
import { useSearchParams } from 'react-router-dom';
import PaginationButtons from '../components/PaginationButtons';

const ManagerTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    console.log(searchParams.toString())
    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <div style={{ minHeight: '100vh' }}>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '2rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '50rem' }}>
                <h3>All Transactions</h3>
                    <TransactionsList searchParamsString={searchParams.toString()} view={"manager"} showPagination={true} searchParams={searchParams} setSearchParams={setSearchParams}/>
                </section>
    
                <section style={{ display: 'flex', justifyContent: 'center', flex: '1'}}>
                    <TransactionsFilters setSearchParams={setSearchParams} view={"manager"}/>
                </section>
            </section>
        </div>

        <footer>footer</footer>
    </>
}

export default ManagerTransactions;