import "./people.scss"
import Poster from "../../components/Poster/Poster";
import SkeletonPage from "../../components/SkeletonPage/SkeletonPage";
import SkeletonPoster from "../../components/SkeletonPoster/SkeletonPoster";
import { motion } from "framer-motion";
import { staggerHalf } from "../../motionUtils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { fetchPersonResultsAsync } from "../../redux/persontvmovie/persontvmovie.actions";
import { useEffect } from "react";



/**Is basically a copy of the category page except this handles the mapping of movies and tv shows for a specific person */
const People = ({ match }) => {
    
    const { url } = match;
    const slicedUrl = url.split("/");
    const dispatch = useDispatch();
    const personName = slicedUrl[2]
    const personID = slicedUrl[3]
    console.log(personID)
    //const preventUndefinedSelector = () => undefined;
    
    useEffect(() => {
        if (personID) {
            dispatch(fetchPersonResultsAsync(personID));
        }
    }, [dispatch, personID]);
    
    const personData = useSelector(state => state.persontvmovieReducer); 
    console.log(personData)

    return (
        <div className="People">
            {personData ? (
                <>
                    <h2 className="People__title">{personName}</h2>

                    <motion.div
                        className="People__wrp"
                        variants={staggerHalf}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {personData.data && personData.data.length > 0
                            && personData.data.map(result => (
                                <Poster
                                    key={result.id}
                                    item={result}
                                    {...result}
                                />
                            ))
                        }
                        {personData.loading && <div className='People__subtitle'><SkeletonPoster /></div>}
                        {personData.error && <div className='People__subtitle'>Oops, an error occurred.</div>}
                    
                    </motion.div>
                </>
            ) : <SkeletonPage />}
        </div>
    )
}

export default People
