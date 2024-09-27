import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access auth state
import axiosInstance from '../../api/axiosInstance';
import ReactStars from 'react-stars';
import ReviewModal from './ProfileComponents/ReviewModal'; // Assuming you have a separate modal component
import { selectUsername } from '../../redux/Features/user/authSlice';

const ProfilePage = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]); // State to store reviews
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const currentUsername = useSelector(selectUsername); // Get current logged-in user's username

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/user/${username}`);
                setUser(response.data);

                // Fetch reviews for this user
                const reviewsResponse = await axiosInstance.get(`/review/user/${response.data._id}`);
                setReviews(reviewsResponse.data.reviews);  // Store the reviews
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    const handleReviewSubmit = async () => {
        try {
            await axiosInstance.post('/review', {
                reviewedUser: user._id,
                rating,
                comment,
            });
            setIsModalOpen(false);
            alert('Review submitted!');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!user) return <div className="flex justify-center items-center h-screen">User not found</div>;

    const joinedDate = new Date(user.createdAt);
    const joinedTime = getJoinedDuration(joinedDate);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Section - Profile Info */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-full md:w-1/3 py-20 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                    <img
                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4"
                        src={`http://localhost:3000/public${user.info.profilePic}`}
                        alt={`${user.name}'s profile picture`}
                    />
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center">{user.name}</h1>
                    <p className="text-lg text-gray-200 text-center">@{user.username}</p>
                    <p className="mt-2 text-gray-200 text-center px-2 mx-2 md:mx-4 border-x-4">{user.bio || 'No bio available.'}</p>
                </div>
                <div className="mt-4 flex flex-col text-center text-white">
                    <p className="text-lg font-semibold">Email: {user.email}</p>
                    <p className="text-lg font-semibold">Joined {joinedTime}</p>
                </div>

                {/* Add Review button if not viewing own profile */}
                {currentUsername !== user.username && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full mt-4"
                    >
                        Add Review
                    </button>
                )}
            </div>

            {/* Right Section - User Details */}
            <main className="w-full md:w-2/3 mx-auto p-6 mt-10 md:mt-0 flex flex-col items-start">
                <UserDetailsSection title="Skills" items={user.info.skills} />
                <UserDetailsSection title="Experience" items={user.info.experience} />
                <PreviousWorksSection works={user.previousWorks} />

                {/* Reviews Section */}
                <section className="w-full mt-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Reviews</h2>
                    <div className="space-y-4 mt-4">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg w-fit">
                                    <Link to={`/user/${review.reviewer.username}`}>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex flex-col items-center">
                                            {review.reviewer.name}
                                        </h3>
                                    </Link>
                                    <div>
                                        <ReactStars
                                            count={5}
                                            value={review.rating}
                                            size={24}
                                            color2={'#ffd700'}
                                            edit={false}
                                        />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2 inline-block mx-auto">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">No reviews available.</p>
                        )}
                    </div>
                </section>
            </main>

            {/* Review Modal */}
            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleReviewSubmit}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
            />
        </div>
    );
};

// Helper function to calculate how long the user has been a member
const getJoinedDuration = (joinedDate) => {
    const now = new Date();
    const diffTime = Math.abs(now - joinedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0) {
        return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else {
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    }
};

// UserDetailsSection component to show Skills/Experience in a flexible way
const UserDetailsSection = ({ title, items }) => (
    <section className="w-full">
        <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h2>
        {items.length > 0 ? (
            <div className="flex flex-wrap mt-2">
                {items.map((item, index) => (
                    <span
                        key={index}
                        className="bg-blue-500 text-white rounded-full px-4 py-2 m-2 text-sm shadow-lg transition duration-300 hover:bg-blue-600 transform hover:scale-105"
                    >
                        {item}
                    </span>
                ))}
            </div>
        ) : (
            <span className="text-gray-600 dark:text-gray-300">No {title.toLowerCase()} listed.</span>
        )}
    </section>
);

// PreviousWorksSection for displaying user's previous works
const PreviousWorksSection = ({ works }) => (
    <section className="w-full">
        <h2 className="mt-8 text-3xl font-bold mb-3 text-gray-800 dark:text-gray-200">Previous Works</h2>
        {works.length > 0 ? (
            <ul className="mt-2 space-y-4 w-full">
                {works.map((work, index) => (
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
                ))}
            </ul>
        ) : (
            <p className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">No previous works listed.</p>
        )}
    </section>
);

export default ProfilePage;
