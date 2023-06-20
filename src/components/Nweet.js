import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDelectClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?")
        if(ok) {
            // delete nweet
            const nweetRef = doc(dbService, "nweets", `${nweetObj.id}`)
            await deleteDoc(nweetRef);
            // delete photo
            await deleteObject(ref(storageService, nweetObj.attachmentUrl));
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
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" />}
                        {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDelectClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                        )}
                    </>
                    )
                }
        </div>
    )
}

export default Nweet;