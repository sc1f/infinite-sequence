const S3_URL = "https://juntan-portfolio-images.s3.amazonaws.com/";
const objectCountFile = "objectCount";
const usedNumbers = new Set();
const previousImages = [];
const sequenceDiv = document.getElementById("sequence");
let count;

const randInt = function(max) {
    return Math.floor(Math.random() * (max + 1));
}

const fetchFromS3 = async function(filename) {
    const resp = await fetch(S3_URL + filename, {
        mode: "cors"
    });
    if (!resp.ok) {
        throw new Error("could not fetch", filename, "status", resp.status);
    }
    return await resp.blob();
}

const getObjectCount = async function() {
    const count = await fetchFromS3(objectCountFile);
    const objectCount = await count.text();
    const countNum = Number.parseInt(objectCount);
    const correctedCount = countNum - 2;
    if (correctedCount <= 0) {
        return 0;
    }
    return correctedCount;
}

const getImageUrl = i => `${S3_URL}${i}.jpg`;

const setImageBackground = imageUrl => {
    sequenceDiv.style.backgroundImage = `url("${imageUrl}")`;
}

const previousImage = count => {
    if (usedNumbers.size === 0 || previousImages.size === 0) {
        return nextImage(count);
    }

    const previousImage = previousImages.pop();
    if (previousImage) {
        setImageBackground(previousImage);
    }
}

const nextImage = count => {
    const imageUrl = generateNewImage(count);
    setImageBackground(imageUrl);
    previousImages.push(imageUrl);
}

const generateNewImage = function(max) {
    let i = randInt(max);
    if (usedNumbers.size === max) {
        usedNumbers.clear();
    }
    while (usedNumbers.has(i)) {
        i = randInt(max);
    }
    usedNumbers.add(i);
    return getImageUrl(i);
}

const handleImageClick = async function(event, count) {
    const x = event.clientX;
    const half = sequenceDiv.offsetWidth / 2;
    const xClickInTarget = x - sequenceDiv.getBoundingClientRect().left;
    if (half > xClickInTarget) {
        previousImage(count);
    } else {
        nextImage(count);
    }
}

const setupClickHandlers = () => {
    sequenceDiv.addEventListener("click", ev => {
        handleImageClick(ev, count);
    });
}

window.addEventListener("load", async function() {
    count = await getObjectCount();
    nextImage(count);
    setupClickHandlers(count);
});