import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBidsForUser } from '../../../redux/reducers/dashboard/bidingSlice';

const BiddingSummary = () => {
    // const dispatch = useDispatch();
    // const { bids, status, error } = useSelector((state) => state.bids);

    // useEffect(() => {
    //     dispatch(fetchBidsForUser());
    // }, [dispatch]);

    // if (status === 'loading') {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <p className="text-xl font-semibold">Loading...</p>
    //         </div>
    //     );
    // }

    // if (status === 'failed') {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <p className="text-red-500 text-xl">Error: {error}</p>
    //         </div>
    //     );
    // }
    const bidstatus = 'accepted';

    return (
        <div className="bg-dark p-6">
            <h2 className="text-xl font-bold text-light mb-8">latest bids</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {bids.map((bid) => (
                    <div key={bid._id} className="bg-gray p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            {bid.job.title}
                        </h3>
                        <p className="text-gray-500 mb-2">Bid Amount: <span className="font-medium text-gray-800">${bid.amount}</span></p>
                        <p className="text-gray-500 mb-4">Status: 
                            <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                bidstatus === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                                {bidstatus}
                            </span>
                        </p>
                    </div>
                ))} */}
                <div className="bg-grey p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                    <h3 className="text-xl font-semibold text-cyan-blue mb-3">
                        bid1
                    </h3>
                    <p className="text-light mb-2">Bid Amount: <span className="font-medium text-light">$342543</span></p>
                    <p className="text-light mb-4">Status: 
                        <span className={`ml-2 inline-block px-3 py-1 border text-sm font-medium ${
                            bidstatus === 'accepted' ? 'text-emerald-100 border-emerald-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {bidstatus}
                        </span>
                    </p>
                </div>
                <div className="bg-grey p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                    <h3 className="text-xl font-semibold text-cyan-blue mb-3">
                        bid2
                    </h3>
                    <p className="text-light mb-2">Bid Amount: <span className="font-medium text-light">$342543</span></p>
                    <p className="text-light mb-4">Status: 
                        <span className={`ml-2 inline-block px-3 py-1 border text-sm font-medium ${
                            bidstatus === 'accepted' ? 'text-emerald-100 border-emerald-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {bidstatus}
                        </span>
                    </p>
                </div>
                <div className="bg-grey p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                    <h3 className="text-xl font-semibold text-cyan-blue mb-3">
                        bid3
                    </h3>
                    <p className="text-light mb-2">Bid Amount: <span className="font-medium text-light">$342543</span></p>
                    <p className="text-light mb-4">Status: 
                        <span className={`ml-2 inline-block px-3 py-1 border text-sm font-medium ${
                            bidstatus === 'accepted' ? 'text-emerald-100 border-emerald-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {bidstatus}
                        </span>
                    </p>
                </div>
            </div>
            
        </div>
    );
};

export default BiddingSummary;
