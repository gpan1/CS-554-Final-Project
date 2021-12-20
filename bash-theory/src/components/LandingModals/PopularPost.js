import React from "react";
import noImage from "../noImage.png";

function PopularPost(){
    return (
        <>
        <div className="box1">
            <div className="box2">
                <img
                    src={noImage}
                    alt={"Test No AvailableImage"}
                    className="box2img"
                ></img>
                </div>
                <div className="box3">
                <p>Patrick Hill. The man, the myth, the legend.</p>
            </div>
        </div>
        <br></br>
        </>
    )
}

export default PopularPost;