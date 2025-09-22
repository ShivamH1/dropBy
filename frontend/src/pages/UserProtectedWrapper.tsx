import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "@/utils/cookieUtils";
import { UserData } from "@/service/context/UserContext";
import { userProfile } from "@/service/API/userAPIs";

function UserProtectedWrapper({ children }: { children: React.ReactNode }) {
  // Optional: Log token for debugging (remove in production)
  const token = getToken();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // @ts-expect-error - UserData is not typed
  const { user, setUser } = useContext(UserData);

  useEffect(() => {
    if (!token) {
      navigate("/user/login");
    }
    userProfile()
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        removeToken()
        navigate("/user/login");
      });
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default UserProtectedWrapper;
