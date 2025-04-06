import React, { useContext } from 'react';
import TransactionsList from '../components/TransactionsList';
import TransactionsFilters from '../components/TransactionFilters';
import { useSearchParams } from 'react-router-dom';

const RegularAllTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    console.log(searchParams.toString())
    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <div style={{ minHeight: '100vh' }}>
            <section style={{ display: 'flex', padding:'1rem 10rem', gap: '5rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '40rem' }}>
                <h3>All My Transactions</h3>
                    <TransactionsList searchParamsString={searchParams.toString()} view={"regular"} showPagination={true} searchParams={searchParams} setSearchParams={setSearchParams}/>
                </section>
    
                <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column'}}>
                    <h3>Filter by</h3>
                    <TransactionsFilters setSearchParams={setSearchParams} view={"regular"}/>
                </section>
            </section>
        </div>

        <footer>footer</footer>
    </>
}

export default RegularAllTransactions;