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
const [ride, setRide] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser, ride, setRide }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;