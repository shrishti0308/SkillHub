import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFreelancerJobs } from '../../../redux/reducers/dashboard/projectsSlice';

const ProjectsSummary = ({ userId }) => {
    // const dispatch = useDispatch();
    // const { freelancerJobs, status, error } = useSelector((state) => state.jobs);

    // useEffect(() => {
    //     dispatch(fetchAvailableJobs(userId));
    // }, [dispatch, userId]);

    // if (status === 'loading') {
    //     return <p>Loading...</p>;
    // }

    // if (status === 'failed') {
    //     return <p>Error: {error}</p>;
    // }
    const jobstatus = 'in-progress'

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-xl font-semibold mb-6">Your Projects</h2>

            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 text-gray-600 bg-gray-100 p-4 rounded-lg font-semibold">
                <span className="col-span-4">Title</span>
                <span className="col-span-4">Description</span>
                <span className="col-span-2">Employer</span>
                <span className="col-span-2 text-right">Status</span>
            </div>

            {/* Projects List */}
            <div className="divide-y divide-gray-200">
                {/* {freelancerJobs.map((job) => (
                    <div
                        key={job._id}
                        className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition duration-200"
                    >
                        <span className="col-span-4 font-semibold text-gray-800">
                            {job.title}
                        </span>

                        <span className="col-span-4 text-gray-600 truncate">
                            {job.description}
                        </span>

                        <span className="col-span-2 text-gray-600">
                            {job.employer.name}
                        </span>

                        <span className={`col-span-2 text-right font-semibold ${job.status === 'completed' ? 'text-emerald-500' : job.status === 'in-progress' ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {job.status}
                        </span>
                    </div>
                ))} */}
                <div
                    className="grid grid-cols-12 gap-4 p-4 transition duration-200"
                >
                    <span className="col-span-4 font-semibold text-gray-800">
                        job1
                    </span>

                    <span className="col-span-4 text-gray-600 truncate">
                        descfjfshkgbfvhdfbvkjfdvg 
                    </span>

                    <span className="col-span-2 text-gray-600">
                        shrishteaaaa
                    </span>

                    <span className={`col-span-2 text-right font-semibold ${jobstatus === 'completed' ? 'text-emerald-500' : jobstatus === 'in-progress' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {jobstatus}
                    </span>
                </div>
                <div
                    className="grid grid-cols-12 gap-4 p-4 transition duration-200"
                >
                    <span className="col-span-4 font-semibold text-gray-800">
                        job2
                    </span>

                    <span className="col-span-4 text-gray-600 truncate">
                        descfjfshkgbfvhdfbvkjfdvg 
                    </span>

                    <span className="col-span-2 text-gray-600">
                        shrishteaaaa
                    </span>

                    <span className={`col-span-2 text-right font-semibold ${jobstatus === 'completed' ? 'text-emerald-500' : jobstatus === 'in-progress' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {jobstatus}
                    </span>
                </div>
                <div
                    className="grid grid-cols-12 gap-4 p-4 transition duration-200"
                >
                    <span className="col-span-4 font-semibold text-gray-800">
                        job3
                    </span>

                    <span className="col-span-4 text-gray-600 truncate">
                        descfjfshkgbfvhdfbvkjfdvg 
                    </span>

                    <span className="col-span-2 text-gray-600">
                        shrishteaaaa
                    </span>

                    <span className={`col-span-2 text-right font-semibold ${jobstatus === 'completed' ? 'text-emerald-500' : jobstatus === 'in-progress' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {jobstatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSummary;
