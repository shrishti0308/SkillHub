import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableJobs } from '../../../redux/reducers/dashboard/jobsSlice';

const RecentJobsSummary = () => {
    // const dispatch = useDispatch();
    // const { jobs, status, error } = useSelector((state) => state.jobs);

    // useEffect(() => {
    //     dispatch(fetchAvailableJobs());
    // }, [dispatch]);

    // if (status === 'loading') {
    //     return <p className="text-white">Loading...</p>;
    // }

    // if (status === 'failed') {
    //     return <p className="text-red-500">Error: {error}</p>;
    // }
    const jobstatus = 'open';

    return (
        <div className='p-6'>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Jobs</h2>

            {/* Table-like layout using grid */}
            <div className="grid grid-cols-4 text-left bg-grey text-cyan-blue font-medium rounded-t-lg">
                <div className="p-3">Job Title</div>
                <div className="p-3">Description</div>
                <div className="p-3">Budget</div>
                <div className="p-3">Status</div>
            </div>

            {/* Map through jobs */}
            {/* {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="grid grid-cols-4 text-left bg-gray-900 text-white border-b border-gray-700">
                    <div className="p-3">{job.title}</div>
                    <div className="p-3">{job.description}</div>
                    <div className="p-3">${job.budget}</div>
                    <div className="p-3">
                        <span className={`px-2 py-1 rounded-full ${
                            job.status === 'open' ? 'bg-green-500' 
                            : job.status === 'in-progress' ? 'bg-yellow-500'
                            : job.status === 'completed' ? 'bg-blue-500'
                            : 'bg-red-500'
                        } text-white`}>
                            {job.status}
                        </span>
                    </div>
                </div>
            ))} */}
            <div className="grid grid-cols-4 text-left bg-grey text-white border-b border-gray-700 my-2">
                <div className="p-3">painting</div>
                <div className="p-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea nam alias vitae. Hic ad dicta, mollitia perspiciatis dolor quod rem!</div>
                <div className="p-3">$20</div>
                <div className="p-3">
                    <span className={`px-2 py-1 ${
                        jobstatus === 'open' ? 'border-yellow-500 text-yellow-100' 
                        : jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                        : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                        : 'bg-red-500'
                    }
                     text-center border text-xs`}>
                        {jobstatus}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 text-left bg-grey text-white border-b border-gray-700 my-2">
                <div className="p-3">painting</div>
                <div className="p-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea nam alias vitae. Hic ad dicta, mollitia perspiciatis dolor quod rem!</div>
                <div className="p-3">$20</div>
                <div className="p-3">
                    <span className={`px-2 py-1 ${
                        jobstatus === 'open' ? 'border-yellow-500 text-yellow-100' 
                        : jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                        : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                        : 'bg-red-500'
                    }
                     text-center border text-xs`}>
                        {jobstatus}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 text-left bg-grey text-white border-b border-gray-700 my-2">
                <div className="p-3">painting</div>
                <div className="p-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea nam alias vitae. Hic ad dicta, mollitia perspiciatis dolor quod rem!</div>
                <div className="p-3">$20</div>
                <div className="p-3">
                    <span className={`px-2 py-1 ${
                        jobstatus === 'open' ? 'border-yellow-500 text-yellow-100' 
                        : jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                        : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                        : 'bg-red-500'
                    }
                     text-center border text-xs`}>
                        {jobstatus}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 text-left bg-grey text-white border-b border-gray-700 my-2">
                <div className="p-3">painting</div>
                <div className="p-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea nam alias vitae. Hic ad dicta, mollitia perspiciatis dolor quod rem!</div>
                <div className="p-3">$20</div>
                <div className="p-3">
                    <span className={`px-2 py-1 ${
                        jobstatus === 'open' ? 'border-yellow-500 text-yellow-100' 
                        : jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                        : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                        : 'bg-red-500'
                    }
                     text-center border text-xs`}>
                        {jobstatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecentJobsSummary;

