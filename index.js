const shp = require("./shapes");
const pt = require("./paint"); 
const prompt = require('prompt-sync')({sigint: true});

let walls = []; 
console.log("Paint Calculator v1");
let currentIndex = 0;  
let ans ="";
while(true){
    if(walls.length>0) console.log(`Current walls: \n${walls.map((v,i) => `${i}: ${v}`).join("\n")}`); 
    console.log("To calculate the total area of the walls needed to paint, enter the walls that you would like to paint:\n" +
    `[A] Add Wall${walls.length > 0 ? "\n[D] Remove Wall" : ""}\n[X] Done, go to next step`); //ask for walls
    ans = prompt();
    
    if(ans.toUpperCase() === "A"){
        //adding wall
        ans = prompt("Enter name of wall: ");
        walls.push(new shp.Wall(ans));
        skipToEdit = true;
        currentIndex = walls.length-1;
        wallPrompt();  
    } else if(ans.toUpperCase() === "D" && walls.length > 0){
        //editing wall - split wall into shapes and add dimensions of said shapes
        let index;
        while(true){
            index = prompt("Enter index of wall to remove: ");
            if(!isNaN(index) && Number(index) >= 0 && Number(index) < walls.length) break; 
            console.log("Incorrect input was entered.");
        }
        walls.splice(Number(index), 1); 
        console.log("Wall successfully removed"); 
    } else if(ans.toUpperCase() === "X"){
        break;
    } else {
        console.log("Incorrect option; Option does not exist.");
    }
}

console.log(`Total area: ${shp.sumAreas(walls)}ft^2`);
pt.paintPricePrompt(shp.sumAreas(walls)); 

function wallPrompt(){ //prompt for editing shape of wall
    let ans = "";
    while(true){//first configure shape of the walll
        console.log("Enter Shape of Wall: ");
        console.log("[R] Wall with Rectangular Shape\n[T] Wall with Triangular Shape\n[C] Wall with Complex Shape"); //ask for shape of wall
        ans = prompt(); 
        if(ans.toUpperCase() === "R"|| ans.toUpperCase() === "T"){
            shapePrompt(walls[currentIndex], ans.toUpperCase() === "R" ? 'r' : 't', "wall", "base", false);
            break; 
        } else if(ans.toUpperCase() === "C"){ //if shape is complex add a bunch of simple shapes that make up the wall shape
            while(true){
                if(walls[currentIndex].shapes.length > 0) 
                    console.log(`Current Shapes:\n${walls[currentIndex].shapes.map((v, i) => `${i}: ${v}`).join("\n")}`);
                console.log("Split wall into simpler shapes (rectangle, triangle, staircase), measure, and add:");
                console.log("NOTE: Estimate shapes with curvature to smallest rectangle that encapsulates it.");
                console.log(`[R] Add rectangle\n[T] Add triangle\n[S] Add staircase\n${walls[currentIndex].shapes.length > 0 ? "\n[D] Remove shape" : ""}\n[X] Done with shape`);
                let ans2 = prompt();
                if(ans2.toUpperCase() === "R" || ans2.toUpperCase() === "T" || ans2.toUpperCase() === "S"){
                    let name = prompt("Enter name of shape: "); 
                    shapePrompt(walls[currentIndex], ans2.toLowerCase(), ans2.toLowerCase() === "s" ? "a single step" : "shape", name, false);
                } else if(ans2.toUpperCase() === "D" && walls[currentIndex].shapes.length > 0){
                    let index;
                    while(true){
                        index = prompt("Enter index of shape to remove: ");
                        if(!isNaN(index) && Number(index) >= 0 && Number(index) < walls[currentIndex].shapes.length) break; 
                        console.log("Incorrect input was entered.");
                    }
                    walls[currentIndex].removeElement("s", Number(index));
                    console.log("Shape successfully removed"); 
                } else if(ans2.toUpperCase() === "X"){
                    break; 
                } else {
                    console.log("Incorrect option; Option does not exist."); 
                }
            }
            break; 
        } else {
            console.log("Incorrect option; Option does not exist."); 
        }
    }

    while(true){//then add obstacles in the wall
        if(walls[currentIndex].obstacles.length > 0) 
            console.log(`Current Obstacles:\n${walls[currentIndex].obstacles.map((v, i) => `${i}: ${v}`).join("\n")}`);
        console.log("Enter obstacles for wall (things that should not or can't be painted like holes, doorways, windows, etc.): ");
        console.log("NOTE: For obstacles with complex shapes just split into simpler shapes (rectangle and triangle) and add as separate obstacles.");
        console.log("NOTE: For shapes with curvature estimate to largest rectangle that fits in shape.");
        console.log(`[R] Add rectangle\n[T] Add triangle${walls[currentIndex].obstacles.length > 0 ? "\n[D] Remove obstacle" : ""}\n[X] Done with obstacles`);
        ans = prompt(); 
        if(ans.toUpperCase() === "R" || ans.toUpperCase() === "T"){
            let name = prompt("Enter name of obstacle: "); 
            shapePrompt(walls[currentIndex], ans.toLowerCase(), "obstacle", name, true); 
            if(walls[currentIndex].calculateArea() <= 0){
                console.log("Too many or too large obstacle(s) added. Wall area is now invalid. Removing most current obstacle.");
                walls[currentIndex].obstacles.pop();
            }
        } else if(ans.toUpperCase() === "D" && walls[currentIndex].obstacles.length > 0){
            let index;
            while(true){
                index = prompt("Enter index of obstacle to remove: ");
                if(!isNaN(index) && Number(index) >= 0 && Number(index) < walls[currentIndex].obstacles.length) break; 
                console.log("Incorrect input was entered.");
            }
            walls[currentIndex].removeElement("o", Number(index));
            console.log("Obstacle successfully removed"); 
        } else if(ans.toUpperCase() === "X"){
            break; 
        } else {
            console.log("Incorrect option; Option does not exist."); 
        }
    }

    console.log("Wall successfully configured."); 
}

function shapePrompt(wall, type, text, name, obs){ //prompt for adding shapes/obstacles to wall
    let length, height, stairs; 
    while(true){
        console.log(`Enter length of ${text} (in feet):`);
        length = prompt();
        console.log(`${type === "s" ? "Enter height difference between steps (in feet):" : `Enter height of ${text} (in feet):`}`);
        height = prompt(); 
        if(type === "s"){
            console.log("Enter number of steps in the shape:");
            stairs = prompt();
        }
        if((!isNaN(length) && Number(length) >= 0) && (!isNaN(height) && Number(height) >= 0) && (type === "s" ? (!isNaN(stairs) && Number(stairs) >= 0) : true)) break; 
        console.log("Incorrect input was entered.");
    }
    if(!obs){
        if(type === "s") wall.addShape(type, [name, Number(length), Number(height), Number(stairs)]);
        else wall.addShape(type, [name, Number(length), Number(height)]);
    } else {
        wall.addObstacle(type, [name, Number(length), Number(height)]);
    }
}