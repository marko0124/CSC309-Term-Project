import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionItemExpanded from "../components/TransactionItemExpanded";
import { useAuth } from "../../../context/authContext";
import apiClient from "../../../api/client";
import HomeNavbar from "../../navbar/HomeNavbar";
import './SingleTransaction.css'

const SingleTransactionRegular = () => {
    const { transactionId } = useParams();
    const [data, setData] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    const url = `transactions/${transactionId}`
    useEffect(() => {
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
            }
        }
        fetchData();
    }, [transactionId]);

    if (data.id) {

        return <>
            <div className='profile-page'>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
                <HomeNavbar />

                {/* Header Section */}
                <div className='header-container'>
                    <div className='header-text'>
                        <h1>Transaction</h1>
                        <div className='header-text-details'>

                        </div>
                        <div className='expandable-text'>
                            <p className='header-text-description'>
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
                    <div className="info-card d-flex flex-column transaction-expanded">
                        <TransactionItemExpanded transaction={data} />
                    </div>
                    

                </section>

                <div className='footer'>Footer</div>
            </div>
        </>
    }

    return <>
    Loading...
    </>
}

export default SingleTransactionRegular;