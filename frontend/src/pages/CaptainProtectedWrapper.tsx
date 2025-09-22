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
        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }
      })
      .catch((err) => {
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
