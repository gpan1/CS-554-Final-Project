import React from 'react';
import ItemModal from './Modals/NewItem';
import ReviewModal from './Modals/NewReview';

function Landing() {
    return (
        <div className='header'>
            <h1 className='sitename'>Tenative Site Name Here</h1>
            <div className='modalButtons'>
                <ItemModal/>
                <ReviewModal/>
            </div>
        </div>
    );
}

export default Landing;