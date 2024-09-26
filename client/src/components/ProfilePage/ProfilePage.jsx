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
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-800 via-gray-900 to-black">
            {/* Sidebar with Logo and Profile Info */}
            <div className="bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 w-full md:w-1/3 py-20 flex flex-col items-center justify-start shadow-lg">
                {/* Logo Section */}
                <img
                    className="w-48 h-auto mb-10"
                    src="/images/skillhub_logo_black.png"
                    alt="SkillHub Logo"
                />

                {/* Profile Section */}
                <div className="flex flex-col items-center text-center">
                    {/* Profile Image with Hover Effect */}
                    <img
                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4 transition-transform duration-300 hover:scale-110"
                        src={`http://localhost:3000/public${user.info.profilePic}`}
                        alt={`${user.name}'s profile picture`}
                    />
                    <h1 className="text-5xl font-extrabold text-white mb-2">{user.name}</h1>
                    <p className="text-xl text-gray-300">@{user.username}</p>
                    <p className="mt-2 text-lg text-gray-300 max-w-xs">{user.bio || "No bio available."}</p>
                </div>
                <div className="mt-6 text-center text-gray-300 space-y-2">
                    <p className="text-lg font-semibold">Email: {user.email}</p>
                    <p className="text-lg font-semibold">Joined {joinedTime}</p>
                </div>
            </div>

            {/* Main Content Section */}
            <main className="w-full md:w-2/3 mx-auto p-6 bg-gray-800 dark:bg-gray-900 mt-10 md:mt-0 flex flex-col items-start space-y-10 text-white shadow-inner">
                {/* Skills Section */}
                <section className="w-full">
                    <h2 className="text-3xl font-bold text-gray-200">Skills</h2>
                    <div className="flex flex-wrap mt-4">
                        {user.info.skills.length > 0 ? (
                            user.info.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full px-4 py-2 m-2 text-sm shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-green-600 transform hover:scale-105"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400">No skills listed.</span>
                        )}
                    </div>
                </section>

                {/* Experience Section */}
                <section className="w-full">
                    <h2 className="text-3xl font-bold text-gray-200">Experience</h2>
                    <ul className="list-disc pl-5 mt-4 text-gray-300">
                        {user.info.experience.length > 0 ? (
                            user.info.experience.map((exp, index) => (
                                <li key={index} className="mt-2">{exp}</li>
                            ))
                        ) : (
                            <li className="mt-2 text-gray-400">No experience listed.</li>
                        )}
                    </ul>
                </section>

                {/* Previous Works Section */}
                <section className="w-full">
                    <h2 className="text-3xl font-bold text-gray-200">Previous Works</h2>
                    <ul className="mt-4 space-y-4">
                        {user.previousWorks.length > 0 ? (
                            user.previousWorks.map((work, index) => (
                                <li
                                    key={index}
                                    className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <a
                                        href={work.link}
                                        className="text-blue-400 hover:underline font-semibold"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {work.title}
                                    </a>: <span className="text-gray-300">{work.description}</span>
                                </li>
                            ))
                        ) : (
                            <li className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg">No previous works listed.</li>
                        )}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
