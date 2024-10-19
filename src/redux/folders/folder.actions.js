import { folderActionTypes } from "./folder.types";
import { getUserFolders } from "../../firebase/firebaseUtils";


export const fetchFolderRequest = () => ({
	type: folderActionTypes.FETCH_FOLDER_REQUEST,
});
export const fetchFolderSuccess = (folders) => ({
	
	type: folderActionTypes.FETCH_FOLDER_SUCCESS,
	
	payload: folders,
});

export const fetchFolderFailure = error => ({
	type: folderActionTypes.FETCH_FOLDER_FAILURE,
	payload: error,
});

export const fetchFoldersAsync = () => {
    return async (dispatch) => {
        dispatch(fetchFolderRequest());
        try {
            const res = await getUserFolders(); // Wait for the data
            dispatch(fetchFolderSuccess(res));   // Dispatch success
        } catch (error) {
            const errorMessage = error.message;  // Catch and handle error
            dispatch(fetchFolderFailure(errorMessage));
        }
    };
};