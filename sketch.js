let points = [];

function setup() {
  createCanvas(windowHeight, windowWidth);
}

function draw() {
  background(220);
  fill (100)
  circle(mouseX, mouseY, 20);
  strokeWeight(4);

  for (let i = 0; i < points.length; i++){
    let point = points[i];
    circle(point[0], point[1], 10);
    if (i > 0){
      line(point[0], point[1], points[i-1][0], points[i-1][1]);

      for (let j = 0; j < points.length; j++){
        let otherpoint = points[j];
    
        line(point[0], point[1], otherpoint[0], otherpoint[1]);

    }
  }
}
}


function mousePressed(){
  points.push([mouseX, mouseY]);

  print[points];

}