import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserTransactions } from '../../../redux/reducers/dashboard/earningsSlice';
// import { useSelector } from 'react-redux';

// const EarningsSummary = ({ userId }) => {
const EarningsSummary = () => {
    // const dispatch = useDispatch();
    // const { transactions, totalEarnings, status, error } = useSelector((state) => state.earnings);

    // useEffect(() => {
    //     dispatch(fetchUserTransactions(userId));
    // }, [dispatch, userId]);

    // if (status === 'loading') {
    //     return <p>Loading...</p>;
    // }

    // if (status === 'failed') {
    //     return <p>Error: {error}</p>;
    // }

    return (
        // <div>
        //     <h2>Total Earnings</h2>
        //     <p>Total: ${totalEarnings}</p>

        //     <h3>Recent Transactions</h3>
        //     <ul>
        //         {transactions.slice(0, 5).map((transaction) => (
        //             <li key={transaction._id}>
        //                 <p>Job: {transaction.job.title}</p>
        //                 <p>Amount: ${transaction.amount}</p>
        //                 <p>Status: {transaction.status}</p>
        //                 <p>Type: {transaction.transactionType}</p>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div>
            <h2>Total Earnings</h2>
            {/* <p>Total: ${totalEarnings}</p> */}
            <p>Total: 34344375</p>


            <h3>Recent Transactions</h3>
            <ul>
                {/* {transactions.slice(0, 5).map((transaction) => ( */}
                    <li>
                        <p>Job: hafsys</p>
                        <p>Amount:834095</p>
                        <p>Status: fail</p>
                        <p>Type: hero</p>
                    </li>
                {/* ))} */}
            </ul>
        </div>
    );
};

export default EarningsSummary;
