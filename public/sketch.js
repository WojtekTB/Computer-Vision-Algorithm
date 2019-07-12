var screenW = window.innerWidth, screenH = window.innerHeight;
var canvas;

var myGrid;

var myText;

var mainImage;

var objects = [];

var capture;

function preload(){
  // mainImage = loadImage("./v1_contrast_small.jpg");
  // mainImage = loadImage("./original-small contrast.jpg");
  // mainImage = loadImage("./original_C.jpg");
  mainImage = loadImage("./image_R.jpg");
  // mainImage = loadImage("./red.jpg");
  // mainImage = loadImage("./test.jpg");
  capture = createCapture(VIDEO);
    // mainImage = capture.get();
  // capture.hide();
}

function setup(){
  button = createButton(`snap`);
  button.position(19, 19);
  button.mousePressed(takeSnap);
  Error.stackTraceLimit = Infinity;
  let objetsOnScreen = [];
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('mainSketch');
  background(118,199,0);
  mainImage.resize(120, mainImage.height * (120/mainImage.width));
  image(mainImage, 0, 0, mainImage.width*4, mainImage.height*4);
  mainImage.loadPixels();
  // console.log(mainImage.pixels);
  let convertedPixels1 = [];
  for(let i = 0; i < mainImage.pixels.length/4;i++){
    let pixel = (mainImage.pixels[i*4] + mainImage.pixels[(i*4) + 1] + mainImage.pixels[(i*4) + 2])/3;
    let balance = 100;
    if(pixel >= 0 && pixel < balance){
      convertedPixels1.push(1);//is black
    }
    else if(pixel <= 255 && pixel > balance){
      convertedPixels1.push(0);//is white
    }
  }
let limit = 0.35;
  let convertedPixelsR = [];
  for(let i = 0; i < mainImage.pixels.length/4;i++){

    let percentColor = mainImage.pixels[i*4]/(mainImage.pixels[i*4] + mainImage.pixels[i*4 + 1] + mainImage.pixels[i*4 + 2]);
    // console.log(percentColor);

    let pixel = percentColor;
    if(pixel >= 0 && pixel < limit){
      convertedPixelsR.push(0);//is white
    }
    else if(pixel <= 100 && pixel > limit){
      convertedPixelsR.push(1);//is black
    }
  }

  let convertedPixelsG = [];
  for(let i = 0; i < mainImage.pixels.length/4;i++){
  let percentColor = mainImage.pixels[i*4 +1]/(mainImage.pixels[i*4] + mainImage.pixels[i*4 + 1] + mainImage.pixels[i*4 + 2]);

      let pixel = percentColor;
    if(pixel >= 0 && pixel < 200){
      convertedPixelsG.push(0);//is white
    }
    else if(pixel <= 100 && pixel > limit){
      convertedPixelsG.push(1);//is black
    }
  }

  let convertedPixelsB = [];
  for(let i = 0; i < mainImage.pixels.length/4;i++){
  let percentColor = mainImage.pixels[i*4 + 2]/(mainImage.pixels[i*4] + mainImage.pixels[i*4 + 1] + mainImage.pixels[i*4 + 2]);

      let pixel = percentColor;
    if(pixel >= 0 && pixel < limit){
      convertedPixelsB.push(0);//is white
    }
    else if(pixel <= 100 && pixel > limit){
      convertedPixelsB.push(1);//is black
    }
  }

  // console.log(convertedPixels);
  // console.log(convertedPixels);

    gridObject1 = new screenGrid(convertedPixels1, mainImage.width, mainImage.height);
    gridObject2 = new screenGrid(convertedPixelsR, mainImage.width, mainImage.height);
    gridObject3 = new screenGrid(convertedPixelsG, mainImage.width, mainImage.height);
    gridObject4 = new screenGrid(convertedPixelsB, mainImage.width, mainImage.height);

  // floodFill(0, 0);

    drawImage(convertedPixels1, 0, mainImage.height * 4, mainImage.width, mainImage.height, 3);
    imgAnalysis(gridObject1, 10);
    drawImage(convertedPixelsR, (mainImage.width) * 3, mainImage.height * 4, mainImage.width, mainImage.height, 3);
    // imgAnalysis(gridObject2, 100);
    drawImage(convertedPixelsG, (mainImage.width * 2) * 3, mainImage.height * 4, mainImage.width, mainImage.height, 3);
    // imgAnalysis(gridObject3, 100);
    drawImage(convertedPixelsB, (mainImage.width * 3) * 3, mainImage.height * 4, mainImage.width, mainImage.height, 3);
    // imgAnalysis(gridObject4, 100);

  // for(let i = 0; i < objects.length; i++){
  //   objects[i].show(0, 0, 4);
  // }

  for(let i = 0; i < objects.length; i++){
    objects[i].show(0, mainImage.height * 4, 3);
  }

    myText = new textBox(mainImage.width*4 + 10, 10, 200, 200);
    myText.addText(`Image width: ${mainImage.width}`);
    myText.addText(`Image height: ${mainImage.height}`);
    myText.addText(`Number of pixels: ${convertedPixelsR.length}`);
    myText.addText(`Number of objects found: ${objects.length}`);
    myText.show();

}

function draw(){
    image(capture, 0, 0);
}

function takeSnap(){
  mainImage = capture.get();
  setup();
}

class screenGrid{// h, w
  constructor(pixels, w, h){
    this.w = w;
    this.h = h;
    this.grid = [];
    this.pixels = pixels;
    this.fillGrid();
  }
  fillGrid(){
    // console.log(this.pixels);
    for(let j = 0; j < this.h; j++){
      let gridLine = [];
      for(let i = 0; i < this.w; i ++){
        // console.log(this.pixels[i + j*this.width]);
        let node = [this.pixels[i + j*this.w], false];
        gridLine.push(node);
      }
      // console.log(gridLine);
      this.grid.push(gridLine);
    }
    // console.log(this.grid);
  }

}

function drawImage(array, x, y, w, h, scale){
  noStroke();
  for(let i = 0; i < h; i++){
    for(let j = 0; j < w; j++){
      if(array[(i * w) + j] == 0){
        fill(255);
      }
      else{
        fill(0);
      }
      rect((j*scale) + x, (i*scale) + y, 1*scale, 1*scale);
    }
  }
}

function imgAnalysis(gridObject, weight){
  for(let y = 0; y < gridObject.h; y ++){
    for(let x = 0; x < gridObject.w; x ++){
      if(gridObject.grid[y][x][0] == 1 && gridObject.grid[y][x][1] == false){
        objects.push(new myObject(floodFill(x, y, gridObject)));
      }
    }
  }
  //done finding objects
  let i = 0;
  let limitWeight = weight;
  while(objects[i] != null){
    if(objects[i].weight < limitWeight){
      objects.splice(i, 1);
    }
    else{
      i++;
    }

  }
}


function floodFill(startX, startY, gridObject){
  let output = [];
  // console.log(output);
  if(gridObject.grid[startY] == undefined || gridObject.grid[startY][startX] == undefined){
  // console.log(1);
    return;
  }
  else if(gridObject.grid[startY][startX][1] == true){
    return;
  }
  else if(gridObject.grid[startY][startX][0] == 0){
    return;
  }
  else{
    gridObject.grid[startY][startX][1] = true;
    output.push([startX, startY]);
  }

  // let j;
  // j = floodFill(startX + 1, startY);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX - 1, startY);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX, startY + 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX, startY - 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX + 2, startY);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX - 2, startY);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // //   // console.log(3);
  // j = floodFill(startX, startY + 2);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX, startY - 2);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  //
  // j = floodFill(startX + 1, startY + 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j= floodFill(startX - 1, startY - 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX + 1, startY - 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }
  // j = floodFill(startX - 1, startY + 1);
  // if(j != undefined){
  //   output = output.concat(j);
  // }

  if(gridObject.grid[startY] != undefined && gridObject.grid[startY][startX + 1] != undefined){
    if(gridObject.grid[startY][startX + 1][1] == false && gridObject.grid[startY][startX + 1][0] == 1){
      let j;
      j = floodFill(startX + 1, startY, gridObject);
      if(j != undefined){
        output = output.concat(j);
      }
    }
  }
  if(gridObject.grid[startY] != undefined && gridObject.grid[startY][startX - 1] != undefined){
    if(gridObject.grid[startY][startX - 1][1] == false || gridObject.grid[startY][startX - 1][0] == 1){
      let k;
      k = floodFill(startX - 1, startY, gridObject);
      if(k != undefined){
        output = output.concat(k);
      }
    }
  }
  //   // console.log(3);
  if(gridObject.grid[startY + 1] != undefined && gridObject.grid[startY + 1][startX] != undefined){
    if(gridObject.grid[startY + 1][startX][1] == false || gridObject.grid[startY + 1][startX][0] == 1){
      let l;
      l = floodFill(startX, startY + 1, gridObject);
      if(l != undefined){
        output = output.concat(l);
      }
    }
  }
  //   // console.log(4);
  if(gridObject.grid[startY-1] != undefined && gridObject.grid[startY-1][startX] != undefined){
    if(gridObject.grid[startY - 1][startX][1] == false || gridObject.grid[startY - 1][startX][0] == 1){
      let m;
      m = floodFill(startX, startY - 1, gridObject);
      if(m != undefined){
        output = output.concat(m);
      }
    }
  }

  return output;
}




class myObject{
  constructor(pixels){
    this.pixels = pixels;
    this.weight = this.pixels.length;
    this.lowestX;
    this.highestX;
    this.lowestY;
    this.highestY;
    this.findBoundaries();
  }

  show(x, y, magnification){
    noFill();
    // fill(50, 255, 255);
    strokeWeight(4);
    stroke(50, 255, 255);
    rect((this.lowestX * magnification) + x, (this.lowestY * magnification) + y, (this.highestX - this.lowestX) * magnification, (this.highestY - this.lowestY) * magnification);
  }

  findBoundaries(){
    this.lowestX = this.pixels[0][0];;
    this.highestX = this.pixels[0][0];;
    this.lowestY = this.pixels[0][1];;
    this.highestY = this.pixels[0][1];;
    for(let i = 0; i < this.pixels.length; i++){
      if(this.pixels[i][0] < this.lowestX){
        this.lowestX = this.pixels[i][0];
      }
      if(this.pixels[i][0] > this.highestX){
        this.highestX = this.pixels[i][0];
      }
      if(this.pixels[i][1] < this.lowestY){
        this.lowestY = this.pixels[i][1];
      }
      if(this.pixels[i][1] > this.highestY){
        this.highestY = this.pixels[i][1];
      }
    }
  }
}

class textBox{
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.texts = [];
  }

  addText(newString){
    this.texts.push(newString);
  }

  changeText(place, string){
    this.texts[place] = string;
  }

  show(){
    noStroke();
    let numberOfTexts = this.texts.length;
    let size = 12;
    textSize(size);
    for(let i = 0; i < numberOfTexts; i++){
      fill(0);
      text(this.texts[i], this.x, this.y + (i * (size + 1)), this.width, this.height);
    }
  }

}
