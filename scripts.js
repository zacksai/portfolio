// CONTROLS: check for toggle of nav or button clicked, update state accordingly
const toggleNav = () => {
    // toggle when clicked (if it's true, set it to false, else set it to true)
    document.body.dataset.nav = document.body.dataset.nav === "true" ? "false" : "true";

    // move to appropriate state, read "when toggle is clicked in each state, go to this state"
    if (document.body.dataset.state == "S1") {
        document.body.dataset.state = "S2";
    } else if (document.body.dataset.state == "S2") {
        document.body.dataset.state = "S1";
    } else if (document.body.dataset.state == "S3") {
        document.body.dataset.state = "S4";
    } else if (document.body.dataset.state == "S4") {
        document.body.dataset.state = "S3";
    }
}

// Initialize the 'track' variable with the initially visible track
let track = document.getElementById("film");

const toggleButtonClicked = (buttonType) => {
    // toggle when clicked (if it's true, set it to false, else set it to true)
    document.body.dataset.buttonClicked = document.body.dataset.buttonClicked === "true" ? "false" : "true";

    // move to appropriate state, read "when button is clicked in each state, go to this state"
    if (document.body.dataset.state == "S2") { // "immerse"

        // move to state 3, reset button to true (both nav & bc should be true)
        document.body.dataset.state = "S3";
        document.body.dataset.buttonClicked = "true";
        // "immerse"
    } else if (document.body.dataset.state == "S4") {
        document.body.dataset.state = "S3";
        document.body.dataset.nav = "true";
        document.body.dataset.buttonClicked = "true";
    }

    // Add code here: use appropriate div and make others hidden.
    // Get all the track divs
    const tracks = document.querySelectorAll('.image-track');

    setTimeout(() => {
        // Hide all the track divs
        tracks.forEach(track => {
            track.style.display = 'none';
        });
    }, 1100);


    // Get the track div corresponding to the button that was clicked
    let selectedTrack;
    if (buttonType === 'projects') {
        selectedTrack = document.getElementById('projects');
    } else if (buttonType === 'film') {
        selectedTrack = document.getElementById('film');
    } else if (buttonType === 'about') {
        selectedTrack = document.getElementById('about');
    }

    // Delay the display of the new track until after the previous one's animation is finished
    setTimeout(() => {
        // Use the appropriate div
        if (selectedTrack) {
            selectedTrack.style.display = 'flex';
            track = selectedTrack; // Update the 'track' variable
        }
    }, 1100); // Delay the execution of the code for 1100ms to allow the previous track to finish its animation


}

// Get all image tracks
const tracks = document.querySelectorAll(".image-track");

// Store X on press
const handleOnDown = (e) => {
    tracks.forEach((track) => (track.dataset.mouseDownAt = e.clientX));
};

// Store percentage, reset mouse down
const handleOnUp = () => {
    tracks.forEach((track) => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
    });
};

// Calculate % based off movement and transform
const handleOnMove = (e) => {
    tracks.forEach((track) => {
        // Do nothing at 0
        if (track.dataset.mouseDownAt === "0") return;

        // Find difference
        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

        // Calculate %
        const percentage = (mouseDelta / maxDelta) * -100,
            nextPercentageUnconstrained =
                parseFloat(track.dataset.prevPercentage) + percentage,
            nextPercentage = Math.max(
                Math.min(nextPercentageUnconstrained, 0),
                -100
            );

        // Store %
        track.dataset.percentage = nextPercentage;

        // Animate transformation
        track.animate(
            {
                transform: `translate(${nextPercentage}%, -50%)`,
            },
            {duration: 1200, fill: "forwards"}
        );

        for (const image of track.getElementsByClassName("image")) {
            image.animate(
                {
                    objectPosition: `${100 + nextPercentage}% center`,
                },
                {duration: 1200, fill: "forwards"}
            );
        }
    });
};

// listeners
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);
window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);
window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);

// Get the custom cursor element
const customCursor = document.querySelector(".custom-cursor");

// Update the custom cursor position
const updateCursorPosition = (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
};

// Show the custom cursor and hide the default cursor
const showCustomCursor = () => {
    customCursor.style.display = "block";
    document.body.style.cursor = "none";
};

// Hide the custom cursor and show the default cursor
const hideCustomCursor = () => {
    customCursor.style.display = "none";
    document.body.style.cursor = "default";
};

// Add event listeners for image hover
const images = document.querySelectorAll(".image-track .image");
images.forEach((image) => {
    image.addEventListener("mouseenter", showCustomCursor);
    image.addEventListener("mouseleave", hideCustomCursor);
});

// Update the custom cursor position on mousemove
window.addEventListener("mousemove", updateCursorPosition);
