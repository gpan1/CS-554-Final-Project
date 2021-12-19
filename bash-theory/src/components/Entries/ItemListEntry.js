import React from "react";

/**
 * Meant for any list of items
 * 
 * Expected props: {name, description, avgRating, imgUrl (optional), address}
 * @param {object} props 
 * @returns 
 */
function ItemListEntry(props) {
    return (
        <div className="listEntry">
          <img src={props.imgUrl} alt={`image of ${props.name}`} />
          <div class="listEntry-title-desc">
            <h2> {props.name}</h2>
            <p> {props.description} </p>
          </div>
          <p class="listEntry-avgRating">
            {props.avgRating}
          </p>
        </div>
    )
}

export default ItemListEntry;