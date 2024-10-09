import "./poster.scss"
import { motion } from "framer-motion";
import { posterFadeInVariants } from "../../motionUtils";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { FaChevronDown, FaMinus, FaPlay, FaPlus, FaFolderPlus } from "react-icons/fa";
import useGenreConversion from "../../hooks/useGenreConversion";
import { showModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch } from "react-redux";
import { addToFavourites, removeFromFavourites } from "../../redux/favourites/favourites.actions";
import { Link } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useState, useRef } from 'react';
import { useSelector } from "react-redux"
import { getUserFolders } from "../../firebase/firebaseUtils";
import { selectCurrentUser } from '../../redux/auth/auth.selectors';

const Poster = result => {
    const { item, item: { title, original_name, original_title, name, genre_ids, backdrop_path }, isFavourite } = result;
    let fallbackTitle = title || original_title || name || original_name;
    const genresConverted = useGenreConversion(genre_ids);
    const dispatch = useDispatch();

    // newly added: 
    //      - useState to set whether the folder list should be visible or not
    //      - folder list ref to close the folder list when an outside click happens
    //      - currentUser to know which user to search for folders in database for
    const [folderList, setFolderList] = useState(false);
    let userFolders = [];
    const folderListRef = useRef();
    const currentUser = useSelector(selectCurrentUser);

    const handleAdd = event => {
        event.stopPropagation();
        dispatch(addToFavourites({ ...item, isFavourite }));
    };
    const handleRemove = event => {
        event.stopPropagation();
        dispatch(removeFromFavourites({ ...item, isFavourite }));
    };

    const handleModalOpening = () => {
        dispatch(showModalDetail({ ...item, fallbackTitle, genresConverted, isFavourite }));
    };

    const handlePlayAction = event => {
        event.stopPropagation();
    };

    useOutsideClick(folderListRef, () => {
		if (folderList) setFolderList(false);
	});

    /** this function takes in a folder object and an event input (maybe? ouch).
     *  currently, it just prints the name of the folder and the message "you did it!"
     *  to the console, but it is meant to be updated to search through the database
     *  and add the JSON information to the relevant folder belonging to the user.
     * 
     * NOTE: TODO: did not get far enough to check if this function is actually accessing
     * the folder while simultaneously processing the event correctly. 
     * 
     * i tried a few different formats that gave errors and this is the one that didn't but
     * obviously that doesn't necessarily mean working. will try again later.
     * 
     * @param folder: is an object storing information about the folder to add a movie into.
     * 
    */
    const handleAddToFolder = (folder) => {
        event => {
            event.stopPropagation();
            console.log(folder.folderName);
            console.log("you did it!");
        }
    };

    /** this function takes in an event as the parameter. it stops the propagation of the
     *  event to prevent the modal dialog box from opening, and then sets the folder list state
     *  to true so the user can see the list of folders available to add to.
     * 
     * @param event: event registered, in this case clicking the "add to folder" button 
     */
    async function handleFolderListOpen (event) {
        event.stopPropagation();
        userFolders = await getUserFolders(currentUser);
        console.log(userFolders);
        setFolderList(true);
    }

    /** this function takes in an event, stops its propagation, and sets the folder list state
     *  to false to close the folder list if it is open when the folder button on the poster is
     *  clicked.
     * 
     *  @param event: event registered, in this case clicking the "add to folder" button 
     */
    const handleFolderListClose = event => {
        event.stopPropagation();
        setFolderList(false);
    };

    return (
        <motion.div
            variants={posterFadeInVariants}
            className='Poster'
            onClick={handleModalOpening}
        >
            {backdrop_path ? (
                <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
            ) : (
                <>
                    <img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
                    <div className='Poster__fallback'>
                        <span>{fallbackTitle}</span>
                    </div>
                </>
            )}
            <div className="Poster__info">
                <div className="Poster__info--iconswrp">
                    <Link
                        className="Poster__info--icon icon--play"
                        onClick={handlePlayAction}
                        to={'/play'}
                    >
                        <FaPlay />
                    </Link>
                    {!isFavourite
                        ? (
                            <button className='Poster__info--icon icon--favourite' onClick={handleAdd}>
                                <FaPlus />
                            </button>
                        ): (
                            <button className='Poster__info--icon icon--favourite' onClick={handleRemove}>
                                <FaMinus />
                            </button>
                        )}
        
                    <button className='Poster__info--icon icon--toggleModal'>
                        <FaChevronDown onClick={handleModalOpening}/>
                    </button>

                    { /* NEW ADDITION! add to folder button. 
                    there is something wrong with this. TODO*/ }

                    <button
						className='Poster__info--icon icon--toggleModal'
						onClick={ folderList ? handleFolderListClose : handleFolderListOpen }
					>
                        <FaFolderPlus />
						<div className={`Poster__folders--content ${folderList ? "active" : ""}`}>
							{folderList && (
								<ul
									className="Poster__folders--content-wrp"
									ref={folderListRef}
                                    onMouseLeave={() => setFolderList(false)}
								>
                                    <li>
										<strong>Add to folder</strong>
									</li>
                                    <li>no one loves me</li>
                                    { userFolders.map((userFolder, i) => 
                                        <li key={i} onClick={handleAddToFolder(userFolder)}>
                                            {userFolder.folderName}
                                        </li>
                                    )}
								</ul>
							)}
						</div>
                    </button>

                </div>
                <div className="Poster__info--title">
                    <h3>{fallbackTitle}</h3>
                </div>
                <div className="Poster__info--genres">
                    {genresConverted && genresConverted.map(genre => (
                        <span key={`Genre--id_${genre}`} className="genre-title">{genre}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Poster
