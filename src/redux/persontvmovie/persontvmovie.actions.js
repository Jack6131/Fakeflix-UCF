import { personActionTypes } from "./persontvmovie.types"
import axios from "../../axiosInstance";
const { REACT_APP_API_KEY } = process.env;
/**Maps a request message to the specified action type*/
export const fetchPersonResultsRequest = personID => ({
	type: personActionTypes.FETCH_PERSON_TV_MOVIE_REQUEST,
	payload: personID
})

export const fetchPersonResultsSuccess = personID => ({
	type: personActionTypes.FETCH_PERSON_TV_MOVIE_SUCCESS,
	payload: personID
})

export const fetchPersonResultsFailure = errorMessage => ({
	type: personActionTypes.FETCH_PERSON_TV_MOVIES_FAILURE,
	payload: errorMessage
})
// API call that handles getting the information needed to get the tv shows / movies 
export const fetchPersonResultsAsync = personID => {
	return dispatch => {
        dispatch(fetchPersonResultsRequest());
		
		axios.get(`person/${personID}/combined_credits?api_key=${REACT_APP_API_KEY}&language=en-US`)
			.then(response => {
				
				console.log("Results \n"+ response)
				dispatch(fetchPersonResultsSuccess(response.data.cast));
                
			})
			.catch(err => {
				dispatch(fetchPersonResultsFailure(err.message));
			});
           
	}
}