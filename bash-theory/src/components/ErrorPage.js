import React from "react";
import { useNavigate } from "react-router-dom";
import NonLandingHeader from "./NonLandingHeader";
import { Button } from "react-bootstrap";


function ErrorPage(){
    let navigate = useNavigate();

    return (
        <>
        <NonLandingHeader />
        <div className="error">
            <h1>This resource does not exist!</h1>
            <br/><br/>
            <h2><Button variant="errorLink" onClick={() => navigate("/")}>Back to Homepage</Button></h2>
        </div>
        </>
    )
}

export default ErrorPage;