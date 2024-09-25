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
            <div className="grid grid-cols-4 text-left bg-grey text-cyan-blue font-medium rounded-t-lg">
                <div className="p-3">Title</div>
                <div className="p-3">Description</div>
                <div className="p-3">Employer</div>
                <div className="p-3">Status</div>
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
                <div className="grid grid-cols-4 text-left bg-grey text-white border-none my-2">
                    <div className="p-3">job1</div>
                    <div className="p-3">descfjfshkgbfvhdfbvkjfdvg </div>
                    <div className="p-3">shrishteaaaa</div>
                    <div className="p-3">
                        <span className={`px-2 py-1 ${
                            jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                            : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                            : 'bg-red-500'
                        }
                        text-center border text-xs`}>
                            {jobstatus}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 text-left bg-grey text-white border-none my-2">
                    <div className="p-3">job1</div>
                    <div className="p-3">descfjfshkgbfvhdfbvkjfdvg </div>
                    <div className="p-3">shrishteaaaa</div>
                    <div className="p-3">
                        <span className={`px-2 py-1 ${
                            jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                            : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                            : 'bg-red-500'
                        }
                        text-center border text-xs`}>
                            {jobstatus}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 text-left bg-grey text-white border-none my-2">
                    <div className="p-3">job1</div>
                    <div className="p-3">descfjfshkgbfvhdfbvkjfdvg </div>
                    <div className="p-3">shrishteaaaa</div>
                    <div className="p-3">
                        <span className={`px-2 py-1 ${
                            jobstatus === 'in-progress' ? 'border-emerald-500 text-emerald-100'
                            : jobstatus === 'completed' ? 'border-indigo-500 text-indigo-100'
                            : 'bg-red-500'
                        }
                        text-center border text-xs`}>
                            {jobstatus}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSummary;
