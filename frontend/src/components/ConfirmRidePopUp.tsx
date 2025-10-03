import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startRide } from "../service/API/rideAPIs";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!props.rideData) return;
    
    if (otp.length !== 4) {
      setError("OTP must be 4 digits");
      return;
    }

    setIsStarting(true);
    setError("");
    
    try {
      const response = await startRide(props.rideData._id, otp);
      if (response.status === 200) {
        navigate("/captain-riding", { state: { rideData: response.data } });
      }
    } catch (error) {
      console.error("Failed to start ride:", error);
      setError(error?.response?.data?.message || "Invalid OTP or failed to start ride");
    } finally {
      setIsStarting(false);
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
          props.setConfirmRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
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
        <h5 className="text-lg font-semibold">{props.rideData?.distance ? `${props.rideData.distance} KM` : "N/A"}</h5>
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

        <div className="mt-6 w-full">
          <form onSubmit={submitHandler}>
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
              type="text"
              maxLength={4}
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
            />
            
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isStarting}
              className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:bg-gray-400"
            >
              {isStarting ? "Starting..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
