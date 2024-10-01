import './detailModal.scss'
import { useEffect, useRef,useState } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { staggerOne, modalOverlayVariants, modalVariants, modalFadeInUpVariants } from "../../motionUtils";
import { hideModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch, useSelector } from "react-redux";
import { selectModalContent, selectModalState } from "../../redux/modal/modal.selectors";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { VscChromeClose } from "react-icons/vsc";
import { capitalizeFirstLetter, dateToYearOnly } from "../../utils";
import { FaMinus, FaPlay, FaPlus } from "react-icons/fa";

import { addToFavourites, removeFromFavourites } from "../../redux/favourites/favourites.actions";
import useOutsideClick from "../../hooks/useOutsideClick";
const { REACT_APP_API_KEY } = process.env;


/**This async function takes in the media type wether it be tv or movie and then the id of said movie/tv show and then will call an api to get the
 * @param id: is a number refering to a unique id of a movie
 * @param media_type: is a string that will show either "tv" or "movie"
 * actors of that specific show
 */
async function mapActorsToTVOrMovie(media_type,id){
	
	//the api call to get a specifc movie/tv show cast
	const castResponse = await fetch(`https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${REACT_APP_API_KEY}`);

	//if 404 we return an empty list
    if(!castResponse.ok){
		console.log(castResponse)
		return []
	}
    const cast = await castResponse.json();
	return cast.cast.slice(0,4)
}

const DetailModal = () => {

	const dispatch = useDispatch();
	const modalClosed = useSelector(selectModalState);
	const modalContent = useSelector(selectModalContent);

	//actors store the actor information
	const [actors,setActors]= useState('Loading')

	const [doneLoading,setDoneLoading]=useState(false)
	const handleModalClose = () => dispatch(hideModalDetail());
	const { overview, fallbackTitle, backdrop_path, release_date, first_air_date, vote_average, original_language, adult, genresConverted, isFavourite,media_type,id} = modalContent;
	const joinedGenres = genresConverted ? genresConverted.join(', ') : "Not available";

	//Maps the first 4 Actors in the Movie/TV Show to be displayed on modal

	useEffect(()=>{

		/**this is an async function that will call the mapActorsToTVOrMovie api and will format it as string as well as handle 404 errors*/
		async function generateActorList(){
			const listOfActors=await mapActorsToTVOrMovie(media_type,id)
			
			const firstFewActors =(actors && listOfActors.length >0) 
				? listOfActors.map(actor => actor.name).join(', ') 
				: 'No actors available';
		
			setActors(firstFewActors)
		}
		//To prevent constant useEffect calls the if statements only call the api once on open of the api
		if(!modalClosed){
			if(!doneLoading){
				generateActorList()
				setDoneLoading(!doneLoading)
			}
		}
		//on modal close we set the info back to default states
		if(modalClosed){
			setActors('Loading')
			setDoneLoading(false)
		}
		
	},[modalClosed,setDoneLoading,doneLoading,id,media_type,actors])

	const maturityRating = adult === undefined ? "Not available" : adult ? "Suitable for adults only" : "Suitable for all ages";
	const reducedDate = release_date ? dateToYearOnly(release_date) : first_air_date ? dateToYearOnly(first_air_date) : "Not Available";
	const modalRef = useRef();

	const handleAdd = (event) => {
		event.stopPropagation();
		dispatch(addToFavourites({ ...modalContent, isFavourite }));
	}
	const handleRemove = (event) => {
		event.stopPropagation();
		dispatch(removeFromFavourites({ ...modalContent, isFavourite }));
		if (!modalClosed) handleModalClose();
	}
	const handlePlayAnimation = event => {
		event.stopPropagation();
		handleModalClose();
	};
	useOutsideClick(modalRef, () => {
		if (!modalClosed) handleModalClose();
	});

	return (
		<AnimatePresence exitBeforeEnter>
			{!modalClosed && (
				<>
					<motion.div
						variants={modalOverlayVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						key="modalOverlay"
						className={`Modal__overlay ${modalClosed && 'Modal__invisible'}`}
					>
						<motion.div
							key="modal"
							variants={modalVariants}
							ref={modalRef}
							className={`Modal__wrp ${modalClosed && 'Modal__invisible'}`}
						>
							<motion.button
								className="Modal__closebtn"
								onClick={handleModalClose}
							>
								<VscChromeClose />
							</motion.button>
							<div className="Modal__image--wrp">
								<div className="Modal__image--shadow" />
								<img
									className="Modal__image--img"
									src={backdrop_path ? `${BASE_IMG_URL}/${backdrop_path}` : FALLBACK_IMG_URL}
									alt={fallbackTitle}
								/>
								<div className="Modal__image--buttonswrp">
									<Link
										className="Modal__image--button"
										onClick={handlePlayAnimation}
										to={'/play'}
									>
										<FaPlay />
										<span>Play</span>
									</Link>
									{!isFavourite
										? (
											<button className='Modal__image--button-circular' onClick={handleAdd}>
												<FaPlus />
											</button>
										): (
											<button className='Modal__image--button-circular' onClick={handleRemove}>
												<FaMinus />
											</button>
										)}
								</div>
							</div>
							<motion.div variants={staggerOne} initial="initial" animate="animate" exit="exit" className="Modal__info--wrp">
								<motion.h3 variants={modalFadeInUpVariants} className="Modal__info--title">{fallbackTitle}</motion.h3>
								<motion.p variants={modalFadeInUpVariants} className="Modal__info--description">{overview}</motion.p>
								<motion.hr variants={modalFadeInUpVariants} className="Modal__info--line"/>
								<motion.h4 variants={modalFadeInUpVariants} className="Modal__info--otherTitle">Info on <b>{fallbackTitle}</b></motion.h4>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>Genres: </span>
									<span className="Modal__info--row-description">{joinedGenres}</span>
								</motion.div>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>
										{release_date ? "Release date: " : "First air date: "}
									</span>
									<span className="Modal__info--row-description">{reducedDate}</span>
								</motion.div>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>Average vote: </span>
									<span className="Modal__info--row-description">{vote_average || "Not available"}</span>
								</motion.div>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>Original language: </span>
									<span className="Modal__info--row-description">{capitalizeFirstLetter(original_language)}</span>
								</motion.div>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>Age classification: </span>
									<span className="Modal__info--row-description">{maturityRating}</span>
								</motion.div>
								<motion.div variants={modalFadeInUpVariants} className="Modal__info--row">
									<span className='Modal__info--row-label'>Actors: </span>
									<span className="Modal__info--row-description">{actors}</span>
								</motion.div>
								
								
							
							</motion.div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default DetailModal
