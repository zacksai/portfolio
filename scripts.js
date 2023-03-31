// Loading circle at beginning of page
window.onload = function () {
    document.getElementById("loader").style.display = "none";
    animateNavToggle();
}

// mouse over toggle listeners
let isMouseOverNavToggle = false;
let firstHover = false;
const navToggle = document.getElementById("nav-toggle");
const openIcon = document.querySelector(".openUp");

// Add event listeners to detect hover state
navToggle.addEventListener("mouseenter", () => {
    isMouseOverNavToggle = true;
    firstHover = true;
});
navToggle.addEventListener("mouseleave", () => {
    isMouseOverNavToggle = false;
    // reset when mouse leaves nav toggle after it has entered on prompt
    navToggle.style.transform = "scale(1)";
    openIcon.style.opacity = "0";
});

// Prompt nav-toggle after a bit
function animateNavToggle() {

    // prompt after a bit
    setTimeout(() => {

        // only execute if first hover hasn't happened
        if (!firstHover) {
            navToggle.style.transform = "scale(1.17)";
            openIcon.style.opacity = "1";
        }
        // reset it after a second if mouse has left
        setTimeout(() => {
            if (!isMouseOverNavToggle) {
                navToggle.style.transform = "scale(1)";
                openIcon.style.opacity = "0";
            }
            // add another event listener to apply the hover styling again
            navToggle.addEventListener("mouseenter", () => {
                navToggle.style.transform = "scale(1.17)";
                if (document.body.dataset.state == "S1" || document.body.dataset.state == "S4") {
                    openIcon.style.opacity = "1";

                }
            });
        }, 1500);

    }, 100);

}

// State machine updates when nav button is toggled
const toggleNav = () => {

    // toggle when clicked (if it's true, set it to false, else set it to true)
    document.body.dataset.nav = document.body.dataset.nav === "true" ? "false" : "true";

    // move to appropriate state, read "when toggle is clicked in each state, go to this state"
    if (document.body.dataset.state == "S1") {
        // update open icon if it was set to 1 from prompt
        if (openIcon.style.opacity == "1") {
            openIcon.style.opacity = "0";
        }
        document.body.dataset.state = "S2";
    } else if (document.body.dataset.state == "S2") {
        document.body.dataset.state = "S1";
    } else if (document.body.dataset.state == "S3") {
        document.body.dataset.state = "S4";
    } else if (document.body.dataset.state == "S4") {
        document.body.dataset.state = "S3";
    }
}

// Store image-displays and selected track
const displays = document.querySelectorAll(".display"); // change me
let selectedDisplays = document.getElementById('film')
let firstTime = true;

// State Machine updates when nav buttons are pressed
const toggleButtonClicked = (buttonType) => {

    // Update selected track based on button clicked
    selectedDisplays = document.getElementById(buttonType);

    // Don't delay the first time...
    if (firstTime) {

        // Hide all displays after animations complete
        displays.forEach(track => {
            track.style.display = 'none';
        });
        selectedDisplays.style.display = 'flex';
        firstTime = false;

    } else { // ...otherwise let previous animation finish before wiping rest
        setTimeout(() => {
            displays.forEach(track => {
                track.style.display = 'none';
            });
            selectedDisplays.style.display = 'flex';
        }, 1100);
    }

    // Make the selected track visible after animations complete
    setTimeout(() => {
        // Only update the selected track
        if (selectedDisplays) {
            selectedDisplays.style.display = 'flex';
            track = selectedDisplays; // Update the 'track' variable
        }
    }, 1100); // Delay the execution of the code for 1100ms to allow the previous track to finish its animation up


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
}

const filmReel = document.getElementById('film');

// Store X on press
const handleOnTouchDown = (e) => {
    filmReel.dataset.mouseDownAt = e.clientX
};

// Store percentage, reset mouse down
const handleOnTouchUp = () => {
        filmReel.dataset.mouseDownAt = "0";
        filmReel.dataset.prevPercentage = filmReel.dataset.percentage;
};

// Calculate % based off movement and transform
const handleOnTouchMove = (e) => {
        // Do nothing at 0
        if (filmReel.dataset.mouseDownAt === "0") return;

        // Find difference
        const mouseDelta = parseFloat(filmReel.dataset.mouseDownAt) - e.clientX,
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
        filmReel.dataset.percentage = nextPercentage;

        // Animate transformation differently on mobile and desktop (smooth)
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
            filmReel.animate(
                {
                    transform: `translate(${nextPercentage}%, 0%)`,
                },
                {duration: 1200, fill: "forwards"}
            );
            for (const image of filmReel.getElementsByClassName("filmImage")) {
                image.animate(
                    {
                        objectPosition: `${100 + nextPercentage}% center`,
                    },
                    {duration: 1200, fill: "forwards"}
                );
            }
        } else {
            // Animate transformation
            const animate = () => {
                filmReel.style.transform = `translate(${nextPercentage}%, 0%)`;
                for (const image of filmReel.getElementsByClassName("filmImage")) {
                    image.style.objectPosition = `${100 + nextPercentage}% center`;
                }
            };
            requestAnimationFrame(animate);
        }

};

// listeners
window.onpointerdown = (e) => handleOnTouchDown(e);
window.ontouchstart = (e) => handleOnTouchDown(e.touches[0]);
window.onpointerup = (e) => handleOnTouchUp(e);
window.ontouchend = (e) => handleOnTouchUp(e.touches[0]);
window.onpointermove = (e) => handleOnTouchMove(e);
window.ontouchmove = (e) => handleOnTouchMove(e.touches[0]);