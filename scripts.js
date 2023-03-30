// Loading circle at beginning of page
window.onload = function() {
  document.getElementById("loader").style.display = "none";
}

// State machine updates when nav button is toggled
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

// Store image-tracks and selected track
const tracks = document.querySelectorAll(".image-track");
let selectedTrack = document.getElementById('film')

// State Machine updates when nav buttons are pressed
const toggleButtonClicked = (buttonType) => {
    // toggle when clicked (if it's true, set it to false, else set it to true)
    document.body.dataset.buttonClicked = document.body.dataset.buttonClicked === "true" ? "false" : "true";

    // move to appropriate state, read "when button is clicked in each state, go to this state"
    if (document.body.dataset.state == "S2") { // "immerse"
        // move to state 3, reset button to true (both nav & bc should be true)
        document.body.dataset.state = "S3";
        document.body.dataset.buttonClicked = "true";
    } else if (document.body.dataset.state == "S4") {
        document.body.dataset.state = "S3";
        document.body.dataset.nav = "true";
        document.body.dataset.buttonClicked = "true";
    }

    // Hide all tracks after animations complete
    setTimeout(() => {
        tracks.forEach(track => {
            track.style.display = 'none';
        });
    }, 1100);

    // Update selected track based on button clicked
    if (buttonType === 'projects') {
        selectedTrack = document.getElementById('projects');
    } else if (buttonType === 'film') {
        selectedTrack = document.getElementById('film');
    } else if (buttonType === 'info') {
        selectedTrack = document.getElementById('info');
    }

    // Make the selected track visible after animations complete
    setTimeout(() => {
        // Only update the selected track
        if (selectedTrack) {
            selectedTrack.style.display = 'flex';
            track = selectedTrack; // Update the 'track' variable
        }
    }, 1100); // Delay the execution of the code for 1100ms to allow the previous track to finish its animation up

}

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
                transform: `translate(${nextPercentage}%, 0%)`,
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
