import { Link, useSearchParams } from "react-router-dom";
import TransactionsList from "../components/TransactionsList";
import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";
import HomeNavbar from "../../navbar/HomeNavbar";
import { useAuth } from "../../../context/authContext";
import './index.css'

const RegularTransactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { user } = useAuth();

    return (
        <div className='profile-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />

            {/* Header Section */}
            <div className='header-container'>
                <div className='header-text'>
                    <h1>My Transactions</h1>
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
                        <h3>My Recent Transactions</h3>
                        <Link to={"/transactions/all"}>
                            <button className="edit-button">View all</button>
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
                <div className="info-card">
                    <div className="info-section">
                        <h3> Actions</h3>
                        <Link to={'/transactions/transfer'} className='mb-3'>
                            <button className='edit-button'>Transfer your points</button>
                        </Link>
                        <Link to={'/transactions/redeem'} className='mb-3'>
                            <button className='edit-button'>Redeem points</button>
                        </Link>

                        {/* cashier */}
                        {(user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
                            <h3>Cashier Actions</h3>
                        }
                        {(user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
                            <Link to={'/transactions/cashier/create'} className='mb-3'>
                                <button className='edit-button'>Create a purchase transaction</button>
                            </Link>
                        }
                        {(user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
                            <Link to={'/transactions/cashier/processRedemption'} className='mb-3'>
                                <button className='edit-button'>Process a redemption request</button>
                            </Link>
                        }

                        {/* manager */}
                        {(user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
                            <h3>Manager Actions</h3>
                        }
                        {(user.role === "manager" || user.role === "superuser") &&
                            <Link to={'/transactions/manage/all'} className='mb-3'>
                                <button className='edit-button'>View all transactions</button>
                            </Link>
                        }

                    </div>
                </div>

            </section>

            <div className='footer'>Footer</div>
        </div>
    );
}

export default RegularTransactions;