import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "@/utils/cookieUtils";
import { CaptainData } from "@/service/context/CaptainContext";
import { captainProfile } from "@/service/API/captainAPIs";

const CaptainProtectedWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = getToken();

  // @ts-expect-error - CaptainData is not typed
  const { captain, setCaptain } = useContext(CaptainData);

  useEffect(() => {
    if (!token) {
      navigate("/captain/login");
    }

    captainProfile()
      .then((response) => {
        console.log("API Response:", response); // Debug log to see the actual response
        if (response.status === 200 || response.status === 304) {
          console.log(response.data.captain);
          setCaptain(response.data.captain);
          setIsLoading(false);
        } else {
          console.log("Unexpected status code:", response.status);
          setIsLoading(false); // Set loading to false even if status doesn't match
        }
      })
      .catch((err) => {
        console.error("API Error:", err); // Debug log for errors
        removeToken();
        navigate("/captain/login");
      });
  }, [navigate, token, setCaptain]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
