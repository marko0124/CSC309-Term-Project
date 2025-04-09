import { Link, useSearchParams } from "react-router-dom";
import TransactionsList from "../components/TransactionsList";
import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";

const CashierTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    return <>
        <header>header</header>
        <nav>Nav bar</nav>
        <section style={{ padding:'1rem 10rem' }}>
            <section style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '66vw', padding: '2rem', maxWidth: '50rem' }}>
                <Card.Body>
                    <Card.Title>Quick Actions</Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <Link to={'/transactions/cashier/create'}>
                            <Button>Create a Purchase</Button>
                        </Link>
                        <Link to={'/transactions/cashier/processRedemption'}>
                            <Button>Process a Redemption Request</Button>
                        </Link>
                    </div>
                </Card.Body>
                </Card>
            </section>
            <section style={{ marginBottom: '5rem' }}/>
            <section style={{ display: 'flex', justifyContent: 'center'}}>
                <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'column', width: '50rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>My Recent Transactions</h3>
                        <Link to={"/transactions/all"}>
                            <Button variant="outline-primary">View All</Button>
                        </Link>

                    </div>
                    <div>
                        <TransactionsList 
                            searchParamsString={searchParams.toString()} 
                            view={"regular"} 
                            showPagination={false} 
                            searchParams={searchParams} 
                            setSearchParams={setSearchParams} 

                        />
                    </div>
                </div>
            </section>
        </section>

        <footer>footer</footer>
    </>
}

export default CashierTransactions;