import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { createRide, getFare } from "../service/API/rideAPIs";
import { useUser } from "../service/context/UserContext";
import { useSocket } from "../service/context/SocketClientContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);

  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  // New states for API integration
  const [activeField, setActiveField] = useState(""); // "pickup" or "destination"
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const [fareData, setFareData] = useState(null);
  const [isFetchingFare, setIsFetchingFare] = useState(false);
  const [pickupCompleted, setPickupCompleted] = useState(false);
  const [destinationCompleted, setDestinationCompleted] = useState(false);

  const { user } = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    socket.emit("join", { userId: user.user._id, userType: "user" });
  }, [socket, user]);

  useEffect(() => {
    const handleRideConfirmed = (data: any) => {
      console.log("Ride confirmed:", data);
      setRideData(data);
      setVehicleFound(false);
      setWaitingForDriver(true);
    };

    const handleRideStarted = (data: any) => {
      console.log("Ride started:", data);
      setWaitingForDriver(false);
      // Navigate to riding page
      window.location.href = "/riding";
    };

    const handleRideEnded = (data: any) => {
      console.log("Ride ended:", data);
      // Handle ride completion
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // Handle location selection from suggestions
  const handleLocationSelection = (selectedAddress) => {
    if (activeField === "pickup") {
      setPickup(selectedAddress);
      setPickupCompleted(true);
    } else if (activeField === "destination") {
      setDestination(selectedAddress);
      setDestinationCompleted(true);
    }
  };

  // Handle Find Trip button click - fetch fare data
  const handleFindTrip = async () => {
    if (!pickup || !destination) {
      console.error("Pickup and destination are required");
      return;
    }

    setIsFetchingFare(true);
    try {
      const response = await getFare({
        pickup,
        destination,
      });

      if (response.data.fare) {
        setFareData(response.data.fare);
        setVehiclePanel(true);
        setPanelOpen(false);
      }
    } catch (error) {
      console.error("Failed to fetch fare data:", error);
      // Set fallback fare data and still open panel
      setFareData({
        auto: 118.86,
        car: 193.2,
        moto: 65.0,
      });
      setVehiclePanel(true);
      setPanelOpen(false);
    } finally {
      setIsFetchingFare(false);
    }
  };

  // Create ride function
  const handleCreateRide = async (vehicleType, vehicleName, fare) => {
    if (!pickup || !destination) {
      console.error("Pickup and destination are required");
      return;
    }

    setIsCreatingRide(true);
    try {
      const response = await createRide({
        pickup,
        destination,
        vehicleType,
      });

      if (response.data.ride) {
        // Include the selected vehicle information with the ride data
        setRideData({
          ...response.data.ride,
          vehicleType,
          vehicleName,
          selectedFare: fare,
        });
        setVehicleFound(true);
        setConfirmRidePanel(false);
      }
    } catch (error) {
      console.error("Failed to create ride:", error);
      // Handle error - maybe show toast notification
    } finally {
      setIsCreatingRide(false);
    }
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
                setPickupCompleted(false); // Reset completion state when user starts editing
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setPickupCompleted(false); // Reset completion state when user types
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
                setDestinationCompleted(false); // Reset completion state when user starts editing
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setDestinationCompleted(false); // Reset completion state when user types
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>
        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setSelectedLocation={handleLocationSelection}
            pickup={pickup}
            destination={destination}
            activeField={activeField}
            onFindTrip={handleFindTrip}
            isFetchingFare={isFetchingFare}
            pickupCompleted={pickupCompleted}
            destinationCompleted={destinationCompleted}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          setSelectedVehicle={setSelectedVehicle}
          pickup={pickup}
          destination={destination}
          fareData={fareData}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          selectedVehicle={selectedVehicle}
          pickup={pickup}
          destination={destination}
          onCreateRide={handleCreateRide}
          isCreatingRide={isCreatingRide}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          setVehicleFound={setVehicleFound}
          rideData={rideData}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          waitingForDriver={waitingForDriver}
          rideData={rideData}
        />
      </div>
    </div>
  );
};

export default Home;
