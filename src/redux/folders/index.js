import { folderActionTypes } from './folder.types';

const initialState = {
    loading: false,
    error: '',
    data: []
}

const folderReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case folderActionTypes.FETCH_FOLDER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case folderActionTypes.FETCH_FOLDER_SUCCESS:
            return {
                ...state,
                data: payload,
                loading: false,
                error: ''
            }

        case folderActionTypes.FETCH_FOLDER_FAILURE:
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
export default folderReducer