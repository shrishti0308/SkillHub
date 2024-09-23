const initialState = {
    accessToken: localStorage.getItem('accessToken') || null, // Load token from localStorage
};


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ACCESS_TOKEN':
            localStorage.setItem('accessToken', action.payload); // Save token to localStorage
            return {
                ...state,
                accessToken: action.payload,
            };
        default:
            return state;
    }
};


export default authReducer;
