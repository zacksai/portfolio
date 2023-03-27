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

const toggleButtonClicked = () => {
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
}


// get img-track element
const track = document.getElementById("image-track");

// Store X on press
const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

// Store percentage, reset mouse down
const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

// Calculate % based off movement and transform
const handleOnMove = e => {
    // Do nothing at 0
    if (track.dataset.mouseDownAt === "0") return;

    // Find difference
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    // Calculate %
    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    // Store %
    track.dataset.percentage = nextPercentage;

    // Animate transformation
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});

    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, {duration: 1200, fill: "forwards"});
    }
}

// listeners
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);