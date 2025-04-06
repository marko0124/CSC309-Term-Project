import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import TransferTransactionCreator from "./components/TransferTransactionCreator";
import { useContext, useState } from "react";
import TransactionsList from "./components/TransactionsList";
import TransactionsFilters from "./components/TransactionFilters";
import PaginationButtons from "./components/PaginationButtons";
import ChangeViewButton from "./components/ChangeViewButton";

const Transactions = () => {
    const { token, role } = useContext(UserContext);
    const navigate = useNavigate();
    const [view, setView] = useState("manager");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferRemark, setTransferRemark] = useState("");
    const [transferRecipientId, setTransferRecipientId] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTransfer = () => {
        try {
            const createData = async () => {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}users/${transferRecipientId}/transactions`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        type: "transfer",
                        amount: transferAmount,
                        remark: transferRemark,
                    }),
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token,
                        "Content-Type": "application/json"
                    })
                });
                if (!res.ok) {
                    // throw new Error(`Response status: ${res.status}`);
                    return <>
                        {res.status}
                    </>
                }
                
                const json = await res.json();
                navigate(`/transactions/${json.id}`);
            }
            createData();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeView = (view) => {
        setView(view);
        setSearchParams({});
    }

    return <>
    { role === "manager" && <ChangeViewButton handleChangeView={handleChangeView} /> }
        <div>
            Transfer points
            <TransferTransactionCreator setAmount={setTransferAmount} setRemark={setTransferRemark} setRecipient={setTransferRecipientId} onClick={handleTransfer}/>
        </div>
        <div className='p-3'>
            <TransactionsFilters setSearchParams={setSearchParams} view={view}/>
            <h3>My Transactions</h3>
            <TransactionsList searchParamsString={searchParams.toString()} view={view} showPagination={true} searchParams={searchParams} setSearchParams={setSearchParams} />
        </div>
    </>
}

export default Transactions;