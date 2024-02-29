// Define variables for sliders
let sliderOne; // Controls the size of the circles
let sliderTwo; // Controls the randomness of circle positions
let sliderThree; // Controls the speed of circle movement
let sliderFour; // Controls the threshold for drawing lines between circles
let colorPicker;

let circles = []; // Array to store the positions of the circles

let sliderOpacity; // Declare a variable for the opacity slider

function setup() {
    createCanvas(600, 600);
    colorMode(HSB, 360, 100, 100, 100); // Update color mode to include alpha

    colorPicker = createColorPicker('#6D90C9');
    colorPicker.position(270, 20);

    // Create sliders
    sliderOne = createSlider(10, 100, 10, 1);
    sliderOne.position(20, 20);
    createSliderText(sliderOne, "Circle Size");

    sliderTwo = createSlider(0, 500, 250, 1);
    sliderTwo.position(20, 40);
    createSliderText(sliderTwo, "Randomness");

    sliderThree = createSlider(0.000, 0.01, 0.005, 0.0001);
    sliderThree.position(20, 60);
    createSliderText(sliderThree, "Speed");

    sliderFour = createSlider(0, 100, 50, 1);
    sliderFour.position(20, 80);
    createSliderText(sliderFour, "Threshold");

    sliderOpacity = createSlider(0, 100, 50, 1); // Create the opacity slider
    sliderOpacity.position(20, 100); // Adjust this position as needed
    createSliderText(sliderOpacity, "Opacity"); // Add label for the new slider


    // Generate circles
    for (let i = 0; i < 40; i++) {
        let radius = 50;
        let angle = map(i, 0, 20, 0, TWO_PI);
        circles[i] = {
            originalX: width / 2 + radius * cos(angle),
            originalY: height / 2 + radius * sin(angle),
            randomX: 0,
            randomY: 0,
            noiseOffsetX: random(0, 1000),
            noiseOffsetY: random(1000, 2000),
            color: null // New property for circle color
        };
        // Set initial color for each circle
        setColorVariation(circles[i]);
    }

    colorPicker.input(() => {
        circles.forEach(circle => {
            setColorVariation(circle);
        });
    });
}

function draw() {
    background(220);

    // Adjust circle and line drawing code to apply opacity
    for (let circle of circles) {
        let randomness = sliderTwo.value();
        circle.randomX = noise(circle.noiseOffsetX + frameCount * sliderThree.value()) * randomness - randomness / 2;
        circle.randomY = noise(circle.noiseOffsetY + frameCount * sliderThree.value()) * randomness - randomness / 2;
        let x = circle.originalX + circle.randomX;
        let y = circle.originalY + circle.randomY;
        
        // Apply the opacity directly here
        let currentOpacity = sliderOpacity.value();
        fill(hue(circle.color), saturation(circle.color), brightness(circle.color), currentOpacity);
        ellipse(x, y, sliderOne.value(), sliderOne.value());

        // Adjust line drawing to apply opacity
        for (let other of circles) {
            if (other === circle) continue; // Skip self
            strokeWeight(sliderOne.value());
            // Apply opacity to stroke as well
            stroke(hue(circle.color), saturation(circle.color), brightness(circle.color), currentOpacity /4);
            let otherX = other.originalX + other.randomX;
            let otherY = other.originalY + other.randomY;
            let distance = dist(x, y, otherX, otherY);
            if (distance < sliderFour.value()) {
                line(x, y, otherX, otherY);
            }
        }
    }
}

function setColorVariation(circle) {
    let baseColor = colorPicker.color();
    colorMode(RGB); // Temporarily switch back to RGB
    let rgbColor = color(red(baseColor), green(baseColor), blue(baseColor));
    colorMode(HSB); // Switch back to HSB
    let h = hue(rgbColor);
    let s = saturation(rgbColor);
    let b = brightness(rgbColor);
    // Create a slight variation in brightness for each circle
    let brightnessVariation = map(noise(circle.noiseOffsetX), 0, 1, -15, 15);
    circle.color = color(h, s, b + brightnessVariation); // No alpha value here
}

function createSliderText(slider, text) {
    let sliderText = createP(text);
    sliderText.position(slider.x + slider.width + 10, slider.y -15);
}
