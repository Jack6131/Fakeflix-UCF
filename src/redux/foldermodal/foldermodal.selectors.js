import { createSelector } from "reselect";

const selectFolderModal = state => state.folderModal;

export const selectFolderModalState = createSelector(
	[selectFolderModal],
	folderModal => folderModal.folderModalIsClosed
)

