import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import Nweet from "components/Nweet";
import { getAuth, updateProfile } from "firebase/auth";


const Profile = ({ refreshUser, userObj }) => {
    const [nweets, setNweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }
    const getMyNweets = async () => {
        const q = query(collection(dbService, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const nweetObj = {
                ...doc.data(),
                id: doc.id
            }
            console.log(nweetObj)
            setNweets((prev) => [nweetObj, ...prev]);
        })
    }
    useEffect(() => {
        getMyNweets();
    }, [])
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            const auth = getAuth();
            const response = await updateProfile(auth.currentUser, {
              displayName: newDisplayName
            }).then(() => {
                refreshUser();
            }).catch((error) => {
              // An error occurred
              // ...
            });
        }
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text" autoFocus className="formInput" placeholder="Display name" value={newDisplayName} onChange={onChange}/>
                <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10 }} />
            </form>
            <div>
                {nweets.map(nweet => (<Nweet key={nweet.id} nweetObj={nweet}/>))}
            </div>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    )
}

export default Profile;