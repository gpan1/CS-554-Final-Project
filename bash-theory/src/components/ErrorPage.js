import React from "react";
import NonLandingHeader from "./NonLandingHeader";

function ErrorPage(){
    return (
        <>
        <NonLandingHeader />
        <div className="error">
            <h1>This resource does not exist!</h1>
            <br/><br/>
            <h2>Link Here Back to Homepage</h2>
        </div>
        </>
    )
}

export default ErrorPage;