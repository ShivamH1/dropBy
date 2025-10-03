const axios = require("axios");
const captainsModel = require("../models/captainsModel");

/**
 * Maps service for handling geocoding and location-related operations
 * Uses MapTiler API for geocoding functionality
 */
class MapsService {
  constructor() {
    this.apiKey = process.env.MAPTILER_API_KEY;
    this.baseUrl = "https://api.maptiler.com";

    if (!this.apiKey) {
      console.warn(
        "MapTiler API key not found. Please set MAPTILER_API_KEY in your .env file"
      );
    }
  }

  /**
   * Convert an address to coordinates (latitude, longitude)
   * @param {string} address - The address to geocode
   * @returns {Promise<Object>} - Object containing coordinates and address details
   */
  async getCoordinatesFromAddress(address) {
    try {
      if (!address || typeof address !== "string") {
        throw new Error("Address is required and must be a string");
      }

      if (!this.apiKey) {
        throw new Error("MapTiler API key is not configured");
      }

      // Encode the address for URL
      const encodedAddress = encodeURIComponent(address.trim());

      // MapTiler Geocoding API endpoint
      const url = `${this.baseUrl}/geocoding/${encodedAddress}.json`;

      const response = await axios.get(url, {
        params: {
          key: this.apiKey,
          limit: 1, // We only need the best match
        },
        timeout: 10000, // 10 second timeout
      });

      const data = response.data;

      if (!data.features || data.features.length === 0) {
        throw new Error("No coordinates found for the provided address");
      }

      const feature = data.features[0];
      const coordinates = feature.geometry.coordinates;

      // MapTiler returns coordinates as [longitude, latitude]
      // We'll return as an object with clear naming
      return {
        success: true,
        data: {
          latitude: coordinates[1],
          longitude: coordinates[0],
          formattedAddress: feature.place_name || feature.text,
          confidence: feature.relevance || 1,
          addressComponents: {
            country: feature.context?.find((c) => c.id.includes("country"))
              ?.text,
            region: feature.context?.find((c) => c.id.includes("region"))?.text,
            place: feature.context?.find((c) => c.id.includes("place"))?.text,
            postcode: feature.context?.find((c) => c.id.includes("postcode"))
              ?.text,
          },
        },
      };
    } catch (error) {
      console.error("Geocoding error:", error.message);

      // Handle different types of errors
      if (error.response) {
        // API responded with an error status
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        if (status === 401) {
          throw new Error("Invalid MapTiler API key");
        } else if (status === 429) {
          throw new Error("API rate limit exceeded. Please try again later");
        } else if (status === 404) {
          throw new Error("Address not found");
        } else {
          throw new Error(`Geocoding API error: ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error(
          "Unable to connect to geocoding service. Please check your internet connection"
        );
      } else {
        // Something else happened
        throw new Error(
          error.message || "An unexpected error occurred during geocoding"
        );
      }
    }
  }

  /**
   * Convert coordinates to an address (reverse geocoding)
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} - Object containing address information
   */
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        throw new Error("Latitude and longitude must be numbers");
      }

      if (!this.apiKey) {
        throw new Error("MapTiler API key is not configured");
      }

      // MapTiler reverse geocoding endpoint
      const url = `${this.baseUrl}/geocoding/${longitude},${latitude}.json`;

      const response = await axios.get(url, {
        params: {
          key: this.apiKey,
          limit: 1,
        },
        timeout: 10000,
      });

      const data = response.data;

      if (!data.features || data.features.length === 0) {
        throw new Error("No address found for the provided coordinates");
      }

      const feature = data.features[0];

      return {
        success: true,
        data: {
          formattedAddress: feature.place_name || feature.text,
          addressComponents: {
            country: feature.context?.find((c) => c.id.includes("country"))
              ?.text,
            region: feature.context?.find((c) => c.id.includes("region"))?.text,
            place: feature.context?.find((c) => c.id.includes("place"))?.text,
            postcode: feature.context?.find((c) => c.id.includes("postcode"))
              ?.text,
          },
        },
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error.message);
      throw new Error(
        error.message || "An error occurred during reverse geocoding"
      );
    }
  }

  /**
   * Get driving distance and time between two addresses using OSRM
   * @param {string} originAddress - Starting address
   * @param {string} destinationAddress - Destination address
   * @returns {Promise<Object>} - Object containing distance, duration and route details
   */
  async getDistanceAndTime(originAddress, destinationAddress) {
    try {
      if (!originAddress || !destinationAddress) {
        throw new Error("Both origin and destination addresses are required");
      }

      // First, geocode both addresses to get coordinates
      const originResult = await this.getCoordinatesFromAddress(originAddress);
      const destinationResult = await this.getCoordinatesFromAddress(
        destinationAddress
      );

      if (!originResult.success || !destinationResult.success) {
        throw new Error("Could not geocode one or both addresses");
      }

      const originCoords = originResult.data;
      const destCoords = destinationResult.data;

      // Use OSRM (Open Source Routing Machine) for routing
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destCoords.longitude},${destCoords.latitude}`;

      const response = await axios.get(osrmUrl, {
        params: {
          overview: "false",
          steps: "false",
          geometries: "geojson",
        },
        timeout: 15000, // 15 second timeout
      });

      const data = response.data;

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found between the specified locations");
      }

      const route = data.routes[0];

      return {
        success: true,
        data: {
          origin: {
            address: originAddress,
            coordinates: {
              latitude: originCoords.latitude,
              longitude: originCoords.longitude,
            },
            formattedAddress: originCoords.formattedAddress,
          },
          destination: {
            address: destinationAddress,
            coordinates: {
              latitude: destCoords.latitude,
              longitude: destCoords.longitude,
            },
            formattedAddress: destCoords.formattedAddress,
          },
          route: {
            distance: {
              meters: Math.round(route.distance),
              kilometers: Math.round((route.distance / 1000) * 100) / 100,
              miles: Math.round((route.distance / 1609.34) * 100) / 100,
            },
            duration: {
              seconds: Math.round(route.duration),
              minutes: Math.round(route.duration / 60),
              hours: Math.round((route.duration / 3600) * 100) / 100,
              formatted: this.formatDuration(route.duration),
            },
          },
        },
      };
    } catch (error) {
      console.error("Distance and time calculation error:", error.message);

      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          throw new Error("Invalid coordinates or route parameters");
        } else if (status === 429) {
          throw new Error(
            "Routing service rate limit exceeded. Please try again later"
          );
        } else {
          throw new Error(
            `Routing service error: ${
              error.response.data?.message || error.message
            }`
          );
        }
      } else if (error.request) {
        throw new Error(
          "Unable to connect to routing service. Please check your internet connection"
        );
      } else {
        throw new Error(
          error.message ||
            "An unexpected error occurred during route calculation"
        );
      }
    }
  }

  /**
   * Get address suggestions/autocomplete based on partial input
   * @param {string} query - Partial address or place name input
   * @param {Object} options - Optional parameters for filtering results
   * @returns {Promise<Object>} - Object containing address suggestions
   */
  async getAddressSuggestions(query, options = {}) {
    try {
      if (!query || typeof query !== "string") {
        throw new Error("Query is required and must be a string");
      }

      if (!this.apiKey) {
        throw new Error("MapTiler API key is not configured");
      }

      // Trim and validate query length
      const trimmedQuery = query.trim();
      if (trimmedQuery.length < 2) {
        return {
          success: true,
          data: {
            suggestions: [],
            query: trimmedQuery,
          },
        };
      }

      // Encode the query for URL
      const encodedQuery = encodeURIComponent(trimmedQuery);

      // MapTiler Geocoding API endpoint with autocomplete
      const url = `${this.baseUrl}/geocoding/${encodedQuery}.json`;

      const params = {
        key: this.apiKey,
        autocomplete: true,
        limit: options.limit || 5, // Default to 5 suggestions
        ...(options.country && { country: options.country }),
        ...(options.proximity && { proximity: options.proximity }),
        ...(options.bbox && { bbox: options.bbox }),
        ...(options.language && { language: options.language }),
      };

      const response = await axios.get(url, {
        params,
        timeout: 10000, // 10 second timeout
      });

      const data = response.data;

      if (!data.features) {
        return {
          success: true,
          data: {
            suggestions: [],
            query: trimmedQuery,
          },
        };
      }

      // Format suggestions for easier consumption
      const suggestions = data.features.map((feature, index) => ({
        id: `suggestion_${index}`,
        text: feature.place_name || feature.text,
        placeName: feature.place_name,
        coordinates: {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        },
        relevance: feature.relevance || 1,
        placeType: feature.place_type || [],
        context: feature.context
          ? feature.context.map((ctx) => ({
              id: ctx.id,
              text: ctx.text,
              shortCode: ctx.short_code,
            }))
          : [],
        properties: {
          category: feature.properties?.category,
          landmark: feature.properties?.landmark,
          address: feature.properties?.address,
        },
      }));

      return {
        success: true,
        data: {
          query: trimmedQuery,
          suggestions,
          count: suggestions.length,
        },
      };
    } catch (error) {
      console.error("Address suggestions error:", error.message);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        if (status === 401) {
          throw new Error("Invalid MapTiler API key");
        } else if (status === 429) {
          throw new Error("API rate limit exceeded. Please try again later");
        } else if (status === 400) {
          throw new Error("Invalid query parameters");
        } else {
          throw new Error(`Geocoding API error: ${message}`);
        }
      } else if (error.request) {
        throw new Error(
          "Unable to connect to geocoding service. Please check your internet connection"
        );
      } else {
        throw new Error(
          error.message ||
            "An unexpected error occurred during address suggestions"
        );
      }
    }
  }

  async getCaptainsInTheRadius(ltd, lng, radius) {
    const captains = await captainsModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[ltd, lng], radius / 6371],
        },
      },
    });

    return captains;
  }

  /**
   * Format duration in seconds to human readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} - Formatted duration string
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Validate if coordinates are within valid ranges
   * @param {number} latitude - Latitude to validate
   * @param {number} longitude - Longitude to validate
   * @returns {boolean} - True if coordinates are valid
   */
  validateCoordinates(latitude, longitude) {
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }
}

module.exports = new MapsService();
