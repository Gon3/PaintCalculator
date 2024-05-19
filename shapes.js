//base class
class Shape {

    constructor(name){
        this.name = name; 
    }

    calculateArea(){
        return 0;
    }

    toString(){
        return this.name; 
    }
}

//extending shape to make rectangle
class Rectangle extends Shape {
    constructor(name, length, height){
        super(name);
        this.length = length;
        this.height = height;
    }

    calculateArea(){
        return this.length * this.height;
    }

    toString(){
        return `Name: ${this.name}, Length: ${this.length}m, Height: ${this.height}m, Area: ${this.calculateArea()}m^2`;
    }
}

//extending rectangle to make triangle (because triangle is basically half of rectangle)
class Triangle extends Rectangle {
    constructor(name, length, height){
        super(name, length, height); 
    }

    calculateArea(){
        return super.calculateArea() * 0.5; 
    }
}

//unique staircase shape so extend off of shape instead
class Staircase extends Rectangle {
    constructor(name, length, height, steps){ //length and height is of a single step
        super(name, length, height); 
        this.steps = steps;
    }

    calculateArea(){
        return super.calculateArea() * ((this.steps * (this.steps +1))/ 2);
    }

    toString(){
        return super.toString() + `, Number of Steps: ${this.steps}`;
    }
}

function sumAreas(arr){
    return arr.reduce((a,b) => a + b.calculateArea(), 0);
}

//the class for wall, extends off of shape
class Wall extends Shape {
    constructor(name){
        super(name);
        this.shapes = [];
        this.obstacles = [];
    }

    addShape(type, parameters){
        switch(type){
            case 'r':
                this.shapes.push(new Rectangle(parameters[0], parameters[1], parameters[2]));
                break;
            case 't':
                this.shapes.push(new Triangle(parameters[0], parameters[1], parameters[2]));
                break;
            case 's':
                this.shapes.push(new Staircase(parameters[0], parameters[1], parameters[2], parameters[3]));
                break;
            default:
                console.log("Shape type does not exist."); 
        }
    }
    addObstacle(type, parameters){
        switch(type){
            case 'r':
                this.obstacles.push(new Rectangle(parameters[0], parameters[1], parameters[2]));
                break;
            case 't':
                this.obstacles.push(new Triangle(parameters[0], parameters[1], parameters[2]));
                break;
            default:
                console.log("Shape type does not exist."); 
        }
    }

    removeElement(array, index){
        if(array === "s")
            this.shapes.splice(index, 1); 
        else 
            this.obstacles.splice(index, 1);
    }

    setElement(array, index, shape){
        if(array === "s")
            this.shapes[index] = shape; 
        else
            this.obstacles[index] = shape;
    }

    getElement(array, index) {
        if(array === "s")
            return this.shapes[index]; 
        else 
            return this.obstacles[index];
    }

    calculateArea(){
        return sumAreas(this.shapes) - sumAreas(this.obstacles); 
    }

    toString(){
        return `Name: ${this.name}, Area: ${this.calculateArea()}m^2`;
    }
}

module.exports = { Wall, Rectangle, Triangle, Staircase, sumAreas };
