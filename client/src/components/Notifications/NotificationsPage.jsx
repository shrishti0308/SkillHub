import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/Features/notificationSlice';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications || []);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <div>
            <h1>Notifications</h1>
            <ul>
                {notifications.map(notification => (
                    <li key={notification._id}>
                        <h2>{notification.title}</h2>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
