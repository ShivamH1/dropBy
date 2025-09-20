import React, { createContext, useState } from "react";

export const UserData = createContext();

function UserContext({ children }) {
  const [user, setUser] = useState({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  });
  return (
    <div>
      <UserData.Provider value={{ user, setUser }}>
        {children}
      </UserData.Provider>
    </div>
  );
}

export default UserContext;
