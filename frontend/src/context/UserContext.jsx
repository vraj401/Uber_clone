import React, { useState } from 'react';

export const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState({
    email: '',
    fullname: {
      firstName: '',
      lastName: ''
    }
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;