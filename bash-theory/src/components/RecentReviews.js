import { React, useState, useEffect } from "react";
import axios from "axios";

function RecentReviews() {
  const [pickData, setPickData] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get("https://ancient-beyond-29069.herokuapp.com/posts/all");
        data = data
          .sort((a, b) => a.date - b.date)
          .reverse()
          .splice(0, 3);
        setPickData(data);
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
    return <h2>Error: 500 Recent Reviews Unavailable</h2>;
  } else {
    return (
      <>
        {pickData.map((post) => {
          return (
            <>
              <div className="box1">
                <h2 className="side">{post.title}</h2>
                <h3 style={{fontSize: '20px'}}>By: {post.posterName}</h3>
                <h3 style={{fontSize: '20px'}}>Rating: {post.rating}/5</h3>
                <p>{post.content}</p>
              </div>
              <br></br>
            </>
          );
        })}
      </>
    );
  }
}

export default RecentReviews;
