import Table from 'react-bootstrap/Table';

const TransactionItem = ({ transaction }) => {
    console.log(transaction.suspicious);
    return <>
          <td>{transaction.id}</td>
          <td>{transaction.utorid}</td>
          <td>{transaction.amount}</td>
          <td>{transaction.type}</td>
          <td>{transaction.spent || '-'}</td>
          <td>{transaction.relatedId || '-'}</td>
          <td>{transaction.promotionIds.length > 0 ? transaction.promotionIds : '-'}</td>
          <td>{transaction.suspicious.toString()}</td>
          <td>{transaction.remark || '-'}</td>
          <td>{transaction.createdBy}</td>
    </>
}

export default TransactionItem;