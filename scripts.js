// toggle navigation menu, turns body's "nav" from true to false
const toggleNav = () => {
    document.body.dataset.nav = document.body.dataset.nav === "true" ? "false" : "true";
}

// get img-track element
const track = document.getElementById("image-track");

// When mouse button is pressed or touch starts, store the X position
const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

// When mouse button is released or touch ends, reset mouseDownAt and store the current percentage
const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

// When the mouse is moved or touch moves, calculate the new percentage and apply the transformation
const handleOnMove = e => {
    // If mouseDownAt is "0", do nothing
    if (track.dataset.mouseDownAt === "0") return;

    // Calculate the difference between the starting X position and the current X position
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    // Calculate the percentage of movement based on maxDelta
    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    // Store the new percentage in the dataset
    track.dataset.percentage = nextPercentage;

    // Animate the track element's transform property
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});

    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, {duration: 1200, fill: "forwards"});
    }
}

// This code sets up event listeners for mouse and touch interactions and passes them to the relevant functions.

window.onmousedown = e => handleOnDown(e); // Listens for the mouse button to be pressed down and passes the event object to handleOnDown function.

window.ontouchstart = e => handleOnDown(e.touches[0]); // Listens for a touch to be initiated and passes the first touch point to handleOnDown function.

window.onmouseup = e => handleOnUp(e); // Listens for the mouse button to be released and passes the event object to handleOnUp function.

window.ontouchend = e => handleOnUp(e.touches[0]); // Listens for the touch to end and passes the first touch point to handleOnUp function.

window.onmousemove = e => handleOnMove(e); // Listens for the mouse to move and passes the event object to handleOnMove function.

window.ontouchmove = e => handleOnMove(e.touches[0]); // Listens for a touch to move and passes the first touch point to handleOnMove function.