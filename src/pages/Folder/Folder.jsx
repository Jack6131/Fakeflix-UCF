
import "./folder.scss"

import { useState } from "react";
import { motion } from "framer-motion";
import { defaultPageFadeInVariants } from "../../motionUtils";


const FolderPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle modal open/close
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
        <motion.div
            className="Folder"
            variants={defaultPageFadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            

           
       
            
            
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Modal Title</h2>
                        <p>This is a simple modal example.</p>
                        <button onClick={toggleModal}>Close Modal</button>
                    </div>
                </div>
            )}
       
           
            
        </motion.div>
        <button onClick={toggleModal}>Open Modal</button>
        </div>
    )
}
export default FolderPage
