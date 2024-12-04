import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../redux/Features/notificationSlice';
import { IoCheckmarkDone } from 'react-icons/io5';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector(state => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markAsRead(notificationId));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8  text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                {notifications?.length > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-cyan-blue hover:text-blue-400 flex items-center gap-1 transition-colors"
                    >
                        <IoCheckmarkDone className="text-lg" />
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    No notifications yet
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications?.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg border border-gray-700 ${
                                notification.isRead ? 'bg-dark' : 'bg-gray-800'
                            } transition-all duration-200 hover:border-gray-600`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-semibold text-white">{notification.title}</h2>
                                    <p className="text-gray-300 mt-1">{notification.message}</p>
                                    <small className="text-gray-500 block mt-2">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </small>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="text-cyan-blue hover:text-blue-400 transition-colors"
                                    >
                                        <IoCheckmarkDone className="text-xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
