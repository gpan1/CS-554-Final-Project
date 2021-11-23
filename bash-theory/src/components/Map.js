// Code mostly obtained from react-google-maps documentation.
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import "../App.css";
// import itemData from "../../../data/items"; // This will be for when the data functions get implemented.

const containerStyle = {
  width: "400px",
  height: "400px",
};

// Coordinates of 1 Castle Point Terrace.
const center = {
  lat: 40.74501,
  lng: -74.02384,
};

function Map() {
  // Set states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [locData, setLocData] = useState(undefined);

  let renderData = () => {
    //TODO: Implement
    console.log("rendering");
  };

  let travel = () => {
    //TODO: Implement
    console.log("travelling");
  };

  useEffect(() => {
    // On Load
    let fetchData = async () => {
      try {
        let data = [{ location: { lat: 40.74237, lng: -74.02905 } }]; // = await itemData.getMarkerData();
        setLocData(data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLocData(e);
        setError(true);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  } else if (error) {
    return <h2>Error: {locData}</h2>;
  } else {
    return (
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {locData.map((data) => {
            return (
              <Marker
                position={data.location}
                onClick={() => renderData()}
                onDblClick={() => travel()}
              ></Marker>
            );
          })}
          <></>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default React.memo(Map);
