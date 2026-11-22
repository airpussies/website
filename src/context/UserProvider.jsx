import React, {useEffect, useState} from "react";
import {generateUserDocument} from "../lib/firebase_user";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../lib/firebase";

export const UserContext = React.createContext({user: null});

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (userAuth) => {
      (async () => {
        const user = await generateUserDocument(userAuth);
        setUser(user);
        setIsLoading(false);
      })();
    });
  }, []);

  return (
    <UserContext.Provider value={{user, isLoading}}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;