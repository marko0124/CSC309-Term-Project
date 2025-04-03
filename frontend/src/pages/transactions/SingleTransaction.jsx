import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Forbidden from "../errors/Forbidden";

const SingleTransaction = () => {
    const { role } = useContext(UserContext);
    if (role !== "manager") {
        return <Forbidden />
    }
}

export default SingleTransaction;