import React from 'react';
import TransactionsList from '../components/TransactionsList';
import TransactionsFilters from '../components/TransactionFilters';
import { useSearchParams } from 'react-router-dom';
import HomeNavbar from '../../navbar/HomeNavbar';


const ManagerTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    return <>
        <div className='profile-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />

            {/* Header Section */}
            <div className='header-container'>
                <div className='header-text'>
                    <h1>Transactions Dashboard</h1>
                    <div className='header-text-details'>

                    </div>
                    <div className='expandable-text'>
                        <p className='header-text-description'>
                            View and manage your transactions
                        </p>
                    </div>
                </div>
            </div>

            <div className="custom-shape-divider-top-1743545933">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>

            {/* Main Content */}
            <section className="page-layout">
                <div className="info-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>All Transactions</h3>

                    </div>
                    <div>
                        <TransactionsList
                            searchParamsString={searchParams.toString()}
                            view={"manager"}
                            showPagination={true}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}

                        />
                    </div>
                </div>
                <div className="info-card">
                    <h3>Filter by</h3>
                    <TransactionsFilters setSearchParams={setSearchParams} view={"manager"} />
                </div>

            </section>

            <div className='footer'>Footer</div>
        </div>
    </>



    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <div style={{ minHeight: '100vh' }}>
            <section style={{ display: 'flex', padding: '1rem 10rem', gap: '5rem' }}>
                <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', justifyContent: 'start', flex: '1', width: '40rem' }}>
                    <h3>All Transactions</h3>
                    <TransactionsList searchParamsString={searchParams.toString()} view={"manager"} showPagination={true} searchParams={searchParams} setSearchParams={setSearchParams} />
                </section>

                <section style={{ display: 'flex', padding: '1rem', justifyContent: 'start', flex: '1', flexDirection: 'column' }}>
                    <h3>Filter by</h3>
                    <TransactionsFilters setSearchParams={setSearchParams} view={"manager"} />
                </section>
            </section>
        </div>

        <footer>footer</footer>
    </>
}

export default ManagerTransactions;