import React from "react";
import ItemModal from './Modals/NewItem';
import ReviewModal from './Modals/NewReview';

function Header(){
    return (
        <div className='header'>
            <h1 className='sitename'>Duck Reviews</h1>
            <br/>
            <div className='modalButtons'>
                <ItemModal/>
                <ReviewModal/>
            </div>
        </div>
    )
}

export default Header;