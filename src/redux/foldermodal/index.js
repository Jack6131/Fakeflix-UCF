import { folderModalActionTypes } from "./foldermodal.types"

const initialState = {
    folderModalIsClosed: true,
    
}

const folderModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case folderModalActionTypes.SHOW_MODAL:
            return {
                ...state,
                folderModalIsClosed: false,
                
            }
        case folderModalActionTypes.HIDE_MODAL:
            return {
                ...state,
                folderModalIsClosed: true,
               
            }
        default:
            return state
    }
}

export default folderModalReducer
