import React from "react";

const VehiclePanel = (props) => {
  // Vehicle configuration with icons and descriptions
  const vehicleTypes = [
    {
      type: "car",
      name: "UberGo",
      capacity: 4,
      icon: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      description: "Affordable, compact rides",
      estimatedTime: "2 mins away"
    },
    {
      type: "moto", 
      name: "Moto",
      capacity: 1,
      icon: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      description: "Affordable motorcycle rides",
      estimatedTime: "3 mins away"
    },
    {
      type: "auto",
      name: "UberAuto", 
      capacity: 3,
      icon: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      description: "Affordable Auto rides",
      estimatedTime: "3 mins away"
    }
  ];
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setVehiclePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      
      {!props.fareData && (
        <div className="flex items-center justify-center p-4">
          <div className="text-gray-500">Loading fare data...</div>
        </div>
      )}

      {vehicleTypes.map((vehicle) => {
        const fare = props.fareData ? props.fareData[vehicle.type] : null;
        console.log(fare);
        
        return (
          <div
            key={vehicle.type}
            onClick={() => {
              props.setConfirmRidePanel(true);
              props.setSelectedVehicle({
                type: vehicle.type,
                name: vehicle.name,
                fare: fare || 0
              });
            }}
            className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer hover:bg-gray-50"
          >
            <img
              className="h-10"
              src={vehicle.icon}
              alt={vehicle.name}
            />
            <div className="ml-2 w-1/2">
              <h4 className="font-medium text-base">
                {vehicle.name}{" "}
                <span>
                  <i className="ri-user-3-fill"></i>{vehicle.capacity}
                </span>
              </h4>
              <h5 className="font-medium text-sm">{vehicle.estimatedTime}</h5>
              <p className="font-normal text-xs text-gray-600">
                {vehicle.description}
              </p>
            </div>
            <h2 className="text-lg font-semibold">
              {fare ? `₹${fare.toFixed(2)}` : (!props.fareData ? "..." : "₹0.00")}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default VehiclePanel;
