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
          <img src={props.post.imgUrl} alt={`${props.post.name}`} />
          <div class="listEntry-title-desc">
            <h2> {props.post.name}</h2>
            <p> {props.post.description} </p>
          </div>
          <p class="listEntry-avgRating">
            {props.post.avgRating}
          </p>
        </div>
    )
}

export default ItemListEntry;