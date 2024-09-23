import axiosInstance from "../../api/axiosInstance";

export const setAccessToken = (accessToken) => ({
    type: 'SET_ACCESS_TOKEN',
    payload: accessToken,
});

// Action to handle signup
export const signup = (userInfo, password, role) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/user/register', {
            ...userInfo,
            password,
            role,
        });

        if (response.data.success) {
            const accessToken = response.data.token;
            dispatch(setAccessToken(accessToken));
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error registering user');
    }
};

// Action to handle login
export const login = (usernameOrEmail, password) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/user/login', {
            usernameOrEmail,
            password,
        });

        if (response.data.success) {
            const accessToken = response.data.token;
            dispatch(setAccessToken(accessToken));
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error logging in user');
    }
};
