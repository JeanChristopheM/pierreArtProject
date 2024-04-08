import React from "react";

const Four = () => {
    return (
        <video width="320" height="240" autoPlay muted id="video">
            <source
                src="https://www.w3schools.com/html/movie.mp4"
                type="video/mp4"
            />
            <source
                src="https://www.w3schools.com/html/movie.ogg"
                type="video/ogg"
            />
            Your browser does not support the video tag.
        </video>
    );
};

export default Four;
