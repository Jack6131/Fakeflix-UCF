
import "./folder.scss"


import { motion } from "framer-motion";
import { defaultPageFadeInVariants } from "../../motionUtils";


const FolderPage = () => {
   

    // Function to toggle modal open/close
    

    return (
        <div>
        <motion.div
            className="Folder"
            variants={defaultPageFadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            

           
       
            
            
         
       
           
            
        </motion.div>
        
        </div>
    )
}
export default FolderPage
