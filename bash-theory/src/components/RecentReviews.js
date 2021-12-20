import { React, useState, useEffect } from "react";
import axios from "axios";

function RecentReviews() {
  const [pickData, setPickData] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get("http://localhost:4000/posts/all");
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
                <p>Reviewer Name: {post.posterName}</p>
                <p>Review Item: {post.title}</p>
                <p>Rating: {post.rating}</p>
                <p>Review: {post.content}</p>
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
