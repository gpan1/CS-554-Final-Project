import { React, useState, useEffect } from "react";
import noImage from "../noImage.png";
import axios from "axios";

function PopularPicks() {
  const [pickData, setPickData] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(
          "https://ancient-beyond-29069.herokuapp.com/locations/popular"
        );
        let temp = data.splice(0, 3);
        let result = [];
        for (let i = 0; i < temp.length; i++) {
          let full = await axios.get(
            `https://ancient-beyond-29069.herokuapp.com/locations/byId/${temp[i]}`
          );
          result.push(full.data);
        }
        console.log(result);
        setPickData(result);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <h2>Loading...</h2>;
  } else if (error) {
    return <h2>Error: 500 Popular Posts Unavailable</h2>;
  } else {
    return (
      <>
        {pickData.map((loc) => {
          return (
            <>
              <div className="box1">
                <div className="box2">
                  <img
                    src={loc.imgUrl ? loc.imgUrl : noImage}
                    alt={loc.name ? loc.name : "No Alt Tag Available"}
                    className="box2img"
                  ></img>
                </div>
                <div className="box3">
                  <p>{loc.name}</p>
                </div>
              </div>
              <br></br>
            </>
          );
        })}
      </>
    );
  }
}

export default PopularPicks;
