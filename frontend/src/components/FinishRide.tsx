import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endRide } from "../service/API/rideAPIs";

const FinishRide = (props) => {
  const [isEnding, setIsEnding] = useState(false);
  const navigate = useNavigate();

  const handleFinishRide = async () => {
    if (!props.rideData) return;

    setIsEnding(true);
    try {
      const response = await endRide(props.rideData._id);
      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Failed to end ride:", error);
    } finally {
      setIsEnding(false);
    }
  };

  if (!props.rideData) {
    return null;
  }

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>
      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.rideData?.user?.fullName?.firstName || "User"}{" "}
            {props.rideData?.user?.fullName?.lastName || ""}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {props.rideData?.distance ? `${props.rideData.distance} KM` : "N/A"}
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.rideData?.pickup || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.rideData?.destination || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.rideData?.fare || "0"} </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          <button
            onClick={handleFinishRide}
            disabled={isEnding}
            className="w-full mt-5 flex text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:bg-gray-400"
          >
            {isEnding ? "Finishing..." : "Finish Ride"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
