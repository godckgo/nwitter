import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faShareAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDelectClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?")
        if(ok) {
            // delete nweet
            const nweetRef = doc(dbService, "nweets", `${nweetObj.id}`)
            await deleteDoc(nweetRef);
            if(nweetObj.attachmentUrl !== "") {
                // delete photo
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
            }
        }
    }
    const toggleEditing = () => {
        setEditing((prev) => !prev)
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        const nweetRef = doc(dbService, "nweets", `${nweetObj.id}`);
        await updateDoc(nweetRef, {
            text: newNweet
        });
        setEditing(false)
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewNweet(value);
    }
    const onShareClick = async (event) => {
        const shareData = {
            title: 'Nwitter',
            text: 'Check out Nwitter',
            url: window.location.href
        }
        if(navigator.share) {
            await navigator
                .share(shareData)
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    }
    return (
        <div className="nweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input type="text" placeholder="Edit your Nweet" className="formInput" autoFocus value={newNweet} onChange={onChange} required />
                            <input type="submit" value="Update Nweet" className="formBtn" />
                        </form>
                        <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                    </>
                    ) :
                    (
                    <>
                        <h4>{nweetObj.text}</h4>
                        {/* <span>{nweetObj.createdAt}</span> */}
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" />}
                        <div className="nweet__actions">
                            {isOwner && ( 
                                <>
                                <span onClick={onDelectClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                                </>
                            )}
                            <span className="shareBtn" onClick={onShareClick}>
                                <FontAwesomeIcon icon={faShareAlt} />
                            </span>
                        </div>
                        
                    </>
                    )
                }
        </div>
    )
}

export default Nweet;