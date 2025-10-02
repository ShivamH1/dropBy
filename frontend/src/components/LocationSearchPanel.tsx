import React, { useState, useEffect, useCallback, useRef } from "react";
import { getAddressSuggestions } from "../service/API/mapsAPIs";

const LocationSearchPanel = (props) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  // Function to fetch suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getAddressSuggestions({
        query,
        limit: 5,
        language: "en"
      });
      
      if (response.data.success && response.data.data?.suggestions) {
        setSuggestions(response.data.data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch address suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetchSuggestions = useCallback((query) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Listen for changes in pickup/destination from parent
  useEffect(() => {
    const currentQuery = props.activeField === "pickup" ? props.pickup : props.destination;
    
    // Don't show suggestions or fetch when user is not actively typing in a field
    if (!props.activeField || !currentQuery) {
      setSuggestions([]);
      setLoading(false);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      return;
    }
    
    // Only fetch suggestions if query is long enough
    if (currentQuery && currentQuery.length >= 2) {
      debouncedFetchSuggestions(currentQuery);
    } else {
      setSuggestions([]);
      setLoading(false);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }
  }, [props.pickup, props.destination, props.activeField, debouncedFetchSuggestions]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="text-gray-500">Loading suggestions...</div>
        </div>
      )}
      
      {/* Show message when both locations are completed */}
      {props.pickupCompleted && props.destinationCompleted ? (
        <div className="flex items-center justify-center p-4">
          <div className="text-green-600 text-center">
            <i className="ri-checkbox-circle-line text-2xl mb-2"></i>
            <p className="text-sm font-medium">Both locations selected!</p>
            <p className="text-xs text-gray-500 mt-1">Click "Find Trip" to continue</p>
          </div>
        </div>
      ) : (
        <>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const selectedAddress = suggestion.place_name || suggestion.text;
                  props.setSelectedLocation(selectedAddress);
                  // Don't immediately open vehicle panel - wait for Find Trip button
                }}
                className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer hover:bg-gray-50"
              >
                <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
                  <i className="ri-map-pin-fill"></i>
                </h2>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{suggestion.text}</h4>
                  {suggestion.place_name && (
                    <p className="text-xs text-gray-600 mt-1">{suggestion.place_name}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            !loading && props.activeField && (
              <div className="flex items-center justify-center p-4">
                <div className="text-gray-500 text-sm">
                  {props.activeField === "pickup" ? (
                    props.pickup && props.pickup.length >= 2 ? "No pickup suggestions found" : "Type pickup location"
                  ) : (
                    props.destination && props.destination.length >= 2 ? "No destination suggestions found" : "Type destination"
                  )}
                </div>
              </div>
            )
          )}
        </>
      )}
      
      {/* Find Trip Button - Only show when both pickup and destination are completed */}
      {props.pickupCompleted && props.destinationCompleted && (
        <div className="mt-4">
          <button
            onClick={props.onFindTrip}
            disabled={props.isFetchingFare}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
              props.isFetchingFare 
                ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {props.isFetchingFare ? "Finding Trip..." : "Find Trip"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
