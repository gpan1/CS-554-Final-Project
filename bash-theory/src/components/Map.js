// Code skeleton from react-google-maps documentation.
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import "../App.css";
import { Button, Modal } from "react-bootstrap";
// import itemData from "../../../data/items"; // This will be for when the data functions get implemented.

const containerStyle = {
  width: "100%",
  height: "500px",
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

  // This state holds the information for the modal's rendering.
  const [show, setShow] = useState({show: false, data: {name: "", description: ""}});

  // Handler functions for the modal.
  const handleClose = () => setShow({show: false, data: {name: "", description: ""}});
  const handleShow = (props) => setShow({show: true, data: props});

  const travel = () => {
    //TODO: Implement a method of redirecting the user to the item's page.
    console.log("travelling");
  };

  // Generate a modal on click of a marker. 
  // This modal will display information on the corresponding item and give the option to navigate to the item page.
  const modal = (
      <Modal show={show.show} onHide={handleClose} centered>
          <Modal.Header closeButton>
              <Modal.Title>
                  {show.data.name}
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {show.data.description}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={travel}>Travel</Button>
          </Modal.Footer>
      </Modal>
  );

  useEffect(() => {
    // On Load
    let fetchData = async () => {
      try {
        // TODO: Make a database function to gather all this information. Something like await itemData.getMarkerData();
        // Here is some dummy data for the meantime.
        let data = [{ name: "Karma Kafe", description: "Good food", location: { lat: 40.74237, lng: -74.02905 } }];
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
    // This renders the map and the modal. 
    // I have decided to make the PoIs from Google non-clickable as it'd potentially interfere with our markers.
    return (
      <div>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} clickableIcons={false}>
            {locData.map((data) => {
              return (
                <Marker
                  position={data.location}
                  onClick={() => handleShow(data)}
                  onDblClick={() => travel()}
                ></Marker>
              );
            })}
            <></>
          </GoogleMap>
        </LoadScript>
        {modal}
      </div>
    );
  }
}

export default React.memo(Map);
