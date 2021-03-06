import React, {useEffect, useState} from "react";
import { Col, Row } from "react-bootstrap";
import NonLandingHeader from "./NonLandingHeader";
import Map from "./Map";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ItemListEntry from './Entries/ItemListEntry';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ItemListing(props) {

  const params = useParams();
  const [type, setType] = useState(params.type ? params.type : null);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setType(params.type);
    const fetchResults = async () => {
      const config = {
        url: `https://ancient-beyond-29069.herokuapp.com/locations/byTags`,
        method: 'post',
        data: {
          type
        }
      };

      console.log(`config: ${JSON.stringify(config)}`);

      try {
        const { data } = await axios(config);
        setItemList(data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchResults();

  }, [type, params.type]);


  return (
    <>
      <NonLandingHeader />
      <div className="listingDiv">
        <h1 style={{ marginBottom: "2rem" }}>{capitalize(type)}:</h1>
        {loading && <p className="noComment">Loading...</p>}
        {!loading && <div className="itemList">
          <Row>
            <Col xs={8}>
              {(itemList && itemList.length > 0) ? itemList.map( x => <ItemListEntry post={x}/>) : <p className="noComment">No entries.</p>}
            </Col>
            <Col>
              <Map />
            </Col>
          </Row>
        </div>}
      </div>
    </>
  );
}

export default ItemListing;