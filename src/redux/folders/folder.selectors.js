import { createSelector } from "reselect";

const selectFolders = state => state.folders;

export const selectFolderList = createSelector(
    [selectFolders],
    folders => folders.data
)