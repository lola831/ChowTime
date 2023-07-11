const GET_REVIEWS = 'reviews/GET_REVIEWS'
const ADD_REVIEWS = 'reviews/ADD_REVIEWS'
const EDIT_REVIEWS = 'reviews/EDIT_REVIEWS'
const DELETE_REVIEWS = 'reviews/DELETE_REVIEWS'

// ----------------------------------------------------- ACTIONS

export const getReviews = (restaurantId, reviews) => {
    return {
        type: GET_REVIEWS,
        restaurantId,
        reviews
    }
}

export const addReview = (restaurantId, newReview) => {
    return {
        type: ADD_REVIEWS,
        restaurantId,
        newReview
    }
}

export const editReview = (restaurantId, newReview) => {
    return {
        type: EDIT_REVIEWS,
        restaurantId,
        newReview
    }
}

export const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEWS,
        reviewId
    }
}

// ----------------------------------------------------------- THUNKS

export const getRestaurantReviews = (restaurantId) => async (dispatch) => {
    const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (res.ok) {
        const reviews = await res.json();
        dispatch(getReviews(restaurantId, reviews));
        return reviews;
    }
}

export const addReviews = (restaurantId, review) => async (dispatch) => {
    const {
        user_id,
        restaurant_id,
        rating,
        comment,
        review_image
    } = review;

    const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id,
            restaurant_id,
            rating,
            comment,
            review_image
        })
    });

    if (res.ok) {
        const review = await res.json();
        dispatch(addReview(restaurantId, review));
        return review
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            const errorData = await res.json()
            return errorData.errors
        } else {
            return ['An error occured. Please try again.']
        }
    }
}

export const editReviews = (restaurantId, reviewId, review) => async (dispatch) => {
    const {
        rating,
        comment,
        review_image
    } = review

    const res = await fetch(`/api/restaurants/${restaurantId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rating,
            comment,
            review_image
        })
    });

    if (res.ok) {
        const review = await res.json();
        dispatch(editReview(review))
        return review
    } else if (res.status < 500) {
        const data = await res.json()
        if (data.errors) {
            const errorData = await res.json()
            return errorData.errors
        } else {
            return ['An error occured. Please try again.']
        }
    }
}

export const deleteReviews = (restaurantId, reviewId) => async (dispatch) => {
    const res = await fetch(`/api/restauants/${restaurantId}/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        const deletedReview = await res.json();
        dispatch(deleteReview(reviewId));
        return deletedReview;
    }
}

// ----------------------------------------------------------------------- REDUCER

const initialState = {
    restaurantReviews: {}
}

export default function reviewsReducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_REVIEWS: {
            newState = { ...state }
            newState.restaurantReviews[action.restaurantId] = action.reviews;
            return newState;
        }
        case ADD_REVIEWS: {
            newState = { ...state }
            newState.restaurantReviews[action.restaurantId] = [
                ...newState.restaurantReviews[ action.restaurantId ],
                action.newReview
            ];
            return newState;
        }
        case EDIT_REVIEWS: {
            newState = { ...state }
            newState.restaurantReviews[action.restaurantId] = newState.restaurantReviews[
                action.restaurantId
            ].map((review) => review.id === action.newReview.id ? action.newReview : review);
            return newState;
        }
        case DELETE_REVIEWS: {
            newState = { ...state }
            newState.restaurantReviews[action.restaurantId] = newState.restaurantReviews[
                action.restaurantId
            ].filter((review) => review.id !== action.reviewId);
            return newState;
        }
        default:
            return state
    }
}