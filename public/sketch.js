var screenW = window.innerWidth, screenH = window.innerHeight;
var canvas;

var myGrid;

var myText;

var mainImage;

var objects = [];

function preload(){
  mainImage = loadImage("./original-small contrast.jpg");
  // mainImage = loadImage("./Contrast.jpg");
  // mainImage = loadImage("./test.jpg");
}

function setup(){
  let objetsOnScreen = [];
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('mainSketch');
  background(118,199,0);
  image(mainImage, 0, 0, mainImage.width*4, mainImage.height*4);
  mainImage.loadPixels();
  // console.log(mainImage.pixels);
  let convertedPixels = [];
  for(let i = 0; i < mainImage.pixels.length/4;i++){
    let pixel = mainImage.pixels[i*4];
    if(pixel >= 0 && pixel < 127){
      convertedPixels.push(1);//is black
    }
    else if(pixel <= 255 && pixel > 127){
      convertedPixels.push(0);//is white
    }
  }
  // console.log(convertedPixels);

  myGrid = new screenGrid(convertedPixels, mainImage.width, mainImage.height);

  // floodFill(0, 0);

  imgAnalysis();

  for(let i = 0; i < objects.length; i++){
    objects[i].show(0, 0, 4);
  }

    myText = new textBox(mainImage.width*4 + 10, 10, 200, 200);
    myText.addText(`Image width: ${mainImage.width}`);
    myText.addText(`Image height: ${mainImage.height}`);
    myText.addText(`Number of pixels: ${convertedPixels.length}`);
    myText.addText(`Number of objects found: ${objects.length}`);
    myText.show();

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

function imgAnalysis(){
  for(let y = 0; y < myGrid.h; y ++){
    for(let x = 0; x < myGrid.w; x ++){
      if(myGrid.grid[y][x][0] == 1 && myGrid.grid[y][x][1] == false){
        objects.push(new myObject(floodFill(x, y)));
      }
    }
  }
  //done finding objects
  let i = 0;
  let limitWeight = 10;
  while(objects[i] != null){
    if(objects[i].weight < limitWeight){
      objects.splice(i, 1);
    }
    else{
      i++;
    }

  }
}


function floodFill(startX, startY){
  let output = [];
  // console.log(output);
  if(myGrid.grid[startY] == undefined || myGrid.grid[startY][startX] == undefined){
  // console.log(1);
    return;
  }
  else if(myGrid.grid[startY][startX][1] == true){
    return;
  }
  else if(myGrid.grid[startY][startX][0] == 0){
    return;
  }
  else{
    myGrid.grid[startY][startX][1] = true;
    output.push([startX, startY]);
  }

    // console.log(1);
  let j;
  j = floodFill(startX + 1, startY);
  if(j != undefined){
    output = output.concat(j);
  }
    // console.log(2);
  j = floodFill(startX - 1, startY);
  if(j != undefined){
    output = output.concat(j);
  }
    // console.log(3);
  j = floodFill(startX, startY + 1);
  if(j != undefined){
    output = output.concat(j);
  }
    // console.log(4);
  j = floodFill(startX, startY - 1);
  if(j != undefined){
    output = output.concat(j);
  }
    // console.log(5);
  // console.log(output.length);
  // let floodOutput = output;
  // output = [];
  // console.log(output);
  return output;
}

function draw(){
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
    rect((x + this.lowestX) * magnification, (y + this.lowestY) * magnification, (this.highestX - this.lowestX) * magnification, (this.highestY - this.lowestY) * magnification);
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

  // addPixel(x,y){
  //   this.pixels.push(x, y);
  //   if(this.lowestX == null || this.highestX == null){
  //     this.lowestX = x;
  //     this.highestX = x;
  //   }
  //   if(this.lowestY == null || this.highestY == null){
  //     this.lowestY = x;
  //     this.highestY = x;
  //   }
  //   if(this.lowestX > x){
  //     this.lowestX = x;
  //   }
  //   if(this.highestX < x){
  //     this.highestX = x;
  //   }
  //   if(this.lowestY > y){
  //     this.lowestY = y;
  //   }
  //   if(this.highestY < y){
  //     this.highestY = y;
  //   }
  // }
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
