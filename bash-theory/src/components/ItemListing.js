import React, {useEffect, useState} from "react";
import { Col, Row } from "react-bootstrap";
import NonLandingHeader from "./NonLandingHeader";
import Map from "./Map";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ItemListEntry from './Entries/ItemListEntry';


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
        url: `http://localhost:4000/locations/byTags`,
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
        <h1 style={{ marginBottom: "2rem" }}>{type}</h1>
        {loading && <p>Loading...</p>}
        {!loading && <div className="itemList">
          <Row>
            <Col xs={8}>
              {itemList.map( x => <ItemListEntry post={x}/>)}
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