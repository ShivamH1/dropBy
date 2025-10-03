import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BACKEND_BASE_URL}`);

function SocketProvider({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const value = {
    socket
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
