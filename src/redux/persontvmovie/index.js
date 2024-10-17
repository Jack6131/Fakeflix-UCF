import {personActionTypes } from './persontvmovie.types';
const initialState = {
    loading: false,
    error: '',
    data: []
}

/**Will display the information depending on the api request return message if it fails or not or is loading still */
export const persontvmovieReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case personActionTypes.FETCH_PERSON_TV_MOVIE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case personActionTypes.FETCH_PERSON_TV_MOVIE_SUCCESS:
            return {
                ...state,
                data: payload,
                loading: false,
                error: ''
            }
        case personActionTypes.FETCH_PERSON_TV_MOVIES_FAILURE:
            return {
                ...state,
                data: [],
                loading: false,
                error: payload
            }
        default:
            return state;
    }
}
