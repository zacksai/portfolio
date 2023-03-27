// toggle navigation menu, turns body's "nav" from true to false
const toggleNav = () => {
    document.body.dataset.nav = document.body.dataset.nav === "true" ? "false" : "true";
}

const toggleButtonClicked = () => {
    document.body.dataset.buttonClicked = document.body.dataset.buttonClicked === "true" ? "false" : "true";
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