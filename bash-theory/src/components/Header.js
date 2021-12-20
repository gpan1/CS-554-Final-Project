import React from "react";
//import ItemModal from './Modals/NewItem';
//import ReviewModal from './Modals/NewReview';
import { useNavigate } from "react-router-dom";

function Header(){
    let navigate = useNavigate();
    return (
        <div className='header'>
            <h1 className='sitename'><button className="btn-header" onClick={() => navigate("/")}>Duck Reviews</button></h1>
        </div>
    )
}

export default Header;