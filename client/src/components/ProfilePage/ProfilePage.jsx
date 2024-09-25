import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ProfilePage = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/user/${username}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!user) return <div className="flex justify-center items-center h-screen">User not found</div>;

    // Calculate joined time
    const joinedDate = new Date(user.createdAt);
    const currentDate = new Date();

    const years = currentDate.getFullYear() - joinedDate.getFullYear();
    const months = currentDate.getMonth() - joinedDate.getMonth();
    const days = currentDate.getDate() - joinedDate.getDate();

    const displayYears = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    const displayMonths = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
    const displayDays = days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '';

    const joinedTime = `${displayYears} ${displayMonths} ${displayDays}`.trim() || 'Joined today';

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-blue-500 to-blue-300 dark:from-blue-700 dark:to-blue-400 w-full md:w-1/3 py-20 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                    <img
                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4"
                        src={`http://localhost:3000/public${user.info.profilePic}`}
                        alt={`${user.name}'s profile picture`}
                    />
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center">{user.name}</h1>
                    <p className="text-lg text-gray-200 text-center">@{user.username}</p>
                    <p className="mt-2 text-gray-200 text-center px-2 mx-2 md:mx-4 border-x-4 ">{user.bio || "No bio available."}</p>
                </div>
                <div className="mt-4 flex flex-col text-center text-white">
                    <p className="text-lg font-semibold">Email: {user.email}</p>
                    <p className="text-lg font-semibold">Joined {joinedTime}</p>
                </div>
            </div>

            <main className="w-full md:w-2/3 mx-auto p-6 bg-white dark:bg-gray-800 mt-10 md:mt-0 flex flex-col items-start">
                <section className="w-full">
                    <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-gray-200">Skills</h2>
                    <div className="flex flex-wrap mt-2">
                        {user.info.skills.length > 0 ? (
                            user.info.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-500 text-white rounded-full px-4 py-2 m-2 text-sm shadow-lg transition duration-300 hover:bg-blue-600 transform hover:scale-105"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-600 dark:text-gray-300">No skills listed.</span>
                        )}
                    </div>
                </section>

                <section className="w-full">
                    <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-gray-200">Experience</h2>
                    <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                        {user.info.experience.length > 0 ? (
                            user.info.experience.map((exp, index) => (
                                <li key={index} className="mt-1">{exp}</li>
                            ))
                        ) : (
                            <li className="mt-1 text-gray-600 dark:text-gray-300">No experience listed.</li>
                        )}
                    </ul>
                </section>

                <section className="w-full">
                    <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-gray-200">Previous Works</h2>
                    <ul className="mt-2 space-y-4 w-full">
                        {user.previousWorks.length > 0 ? (
                            user.previousWorks.map((work, index) => (
                                <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                                    <a
                                        href={work.link}
                                        className="text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {work.title}
                                    </a>: <span className="text-gray-600 dark:text-gray-300">{work.description}</span>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">No previous works listed.</li>
                        )}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
