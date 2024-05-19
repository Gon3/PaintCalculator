//test code for paint
const prompt = require('prompt-sync')({sigint: true});
 //area used for tests
let latexCoverage = 300;
let acrylicCoverage = 250; 
function paintPricePrompt(totalArea){
    let ans; 
    while(true){
        console.log("Choose type of paint: ");
        console.log("[L] Latex\n[A] Acrylic");
        ans = prompt(); 
        if(ans.toUpperCase() === "L" || ans.toUpperCase() === "A") break; 
        console.log("Incorrect option; Option does not exist.");
    }
    let ans2; 
    while (true){
        console.log("Choose finish/sheen of paint: ");
        console.log(`[F] Flat/Matte\n[E] Eggshell${ans.toUpperCase() === "L" ? "" : "\n[A] Satin"}\n[S] Semi-Gloss${ans.toUpperCase() === "L" ? "" : "\n[H] High-Gloss"}`);
        ans2 = prompt(); 
        if(ans2.toUpperCase() === "F" || ans2.toUpperCase() === "E" || ans2.toUpperCase() === "S" || (ans2.toUpperCase() === "A" && ans.toUpperCase() === "A") ||
        (ans2.toUpperCase() === "H" && ans.toUpperCase() === "A")) break; 
        console.log("Incorrect option; Option does not exist.");
    }

    while(true) {
        //calculate total in gallons, ask how many of each can they want or if they just want cheapest
        let totalGallons = totalArea / (ans.toUpperCase() === "L" ? latexCoverage : acrylicCoverage); 
        console.log(`You need about ${Math.ceil(totalGallons)} gallons of paint. Would you like cheapest estimate or to select you own cans?:`);
        console.log("[C] Cheapest Estimate\n[S] Select cans");
        let ans3 = prompt(); 
        if(ans3.toUpperCase() === "C"){
            let canAmounts = calculateCheapest(totalGallons, (ans.toUpperCase() === "L")); 
            reportPrompt(canAmounts, ans2.toUpperCase(), (ans.toUpperCase() === "L"), false, totalGallons);
            
            break;
        } else if(ans3.toUpperCase() === "S"){
            canAmounts = selectPrompt(totalGallons, (ans.toUpperCase() === "L"));
            reportPrompt(canAmounts, ans2.toUpperCase(), (ans.toUpperCase() === "L"), true, totalGallons);
            break;
        } 
        console.log("Incorrect option; Option does not exist.");
    }
}


function calculateCheapest(gallons, latex){
    let fivegals = Math.floor(gallons/5);
    let leftover = gallons - (fivegals * 5); 
    if(leftover === 0 || Math.ceil(leftover) === 5){
        return [fivegals + (Math.ceil(leftover) === 5 ? 1 : 0), 0, 0]; 
    }
    let gals = latex ? Math.ceil(leftover) : Math.floor(leftover); 
    leftover -= gals;
    if(leftover <= 0){
        return [fivegals, gals, 0]; 
    }

    let quarts = Math.ceil(leftover * 4);
    return [fivegals, quarts === 4 ? gals+1: gals, quarts === 4 ? 0: quarts]; 
}

function reportPrompt(canAmounts, sheen, latex, select, galTotal){
    let latexPrices = [[21.98, 98.98], [23.98, 109], [26.98, 122]];
    let acrylicPrices = [[14.98, 29.98, 130], [15.98, 32.98, 162], [16.98, 35.98, 157], [17.98, 37.98, 171], [19.98, 39.98, 179]]; 
    let indexer = latex ? {F:0, E:1, S: 2} : {F: 0, E: 1, A: 2, S: 3, H: 4};
   
    let canString = ""; 
    canString += canAmounts[0] !== 0 ? `${canAmounts[0]} five gallon cans` : "";
    canString += canAmounts[1] !== 0 ? `${canAmounts[0] !== 0 ?", ": ""}${canAmounts[1]} one gallon cans` : "";
    canString += canAmounts[2] !== 0 ? `${canAmounts[1] === 0 && canAmounts[0] === 0 ? "":", "}${canAmounts[2]} one quart cans` : "";
    console.log(`You ${select ? "selected" : "need"} ${canString}.`); 
    let totalAmount;
    if(latex){
        totalAmount = (canAmounts[0] * latexPrices[indexer[sheen]][1]) + (canAmounts[1] * latexPrices[indexer[sheen]][0]);
        if(canAmounts[0] !== 0) console.log(`Price of five gallon cans: $${canAmounts[0] * latexPrices[indexer[sheen]][1]}`);
        if(canAmounts[1] !== 0) console.log(`Price of one gallon cans: $${canAmounts[1] * latexPrices[indexer[sheen]][0]}`);
    }
    else {
        totalAmount = (canAmounts[0] * acrylicPrices[indexer[sheen]][2]) + (canAmounts[1] * acrylicPrices[indexer[sheen]][1]) + (canAmounts[2] * acrylicPrices[indexer[sheen]][0]);
        if(canAmounts[0] !== 0) console.log(`Price of five gallon cans: $${canAmounts[0] * acrylicPrices[indexer[sheen]][2]}`);
        if(canAmounts[1] !== 0) console.log(`Price of one gallon cans: $${canAmounts[1] * acrylicPrices[indexer[sheen]][1]}`);
        if(canAmounts[2] !== 0) console.log(`Price of one quart cans: $${canAmounts[2] * acrylicPrices[indexer[sheen]][0]}`);
    }
    
    console.log(`The total cost is $${totalAmount}`);
    if(select){
        let canTotal = latex ? canAmounts[0]*5 + canAmounts[1] : canAmounts[0]*5 + canAmounts[1] + canAmounts[2]/4; ;
        let leftover = galTotal - canTotal; 
        if(leftover > 0){
            console.log(`The amount of area leftover due to your can selection is: ${latex ? leftover * latexCoverage : leftover * acrylicCoverage}ft^2.`);
            console.log(`${leftover} gallons of paint will cover the remainder.`); 
        }
    }
}

function selectPrompt(gallons, latex){
    let tquarts = 0, tgals = 0, tfiveGals = 0;
    while(true){
        console.log(`DEBUG: ${tfiveGals}`);
        let quarts = 0, gals = 0, fiveGals = 0;
        if(!latex){
            let maxQuarts = Math.ceil(gallons*4); 
            while(true){
                quarts = prompt(`You can have up to ${maxQuarts} one quart cans. Enter the amount you want up to this maximum: `); 
                if(!isNaN(quarts) && Number(quarts) >= 0 || Number(quarts) <= maxQuarts) break;
                console.log("Incorrect input entered."); 
            }
            tquarts += Number(quarts);
            gallons -=  Number(quarts)/4; 
            if(gallons <= 0)
                return [tfiveGals, tgals, tquarts];
        }
        let maxGallons = Math.ceil(gallons); 
        while(true){
            gals= prompt(`You can have up to ${maxGallons} one gallon cans. Enter the amount you want up to this maximum: `); 
            if(!isNaN(quarts) && Number(gals) >= 0 || Number(gals) <= maxGallons) break;
            console.log("Incorrect input entered."); 
        }
        tgals += Number(gals); 
        gallons -= Number(gals); 
        if(gallons <= 0)
            return [tfiveGals, tgals, tquarts]; 

        let maxFiveGallons = Math.ceil(gallons/5);
        while(true){
            fiveGals = prompt(`You can have up to ${maxFiveGallons} five gallon cans. Enter the amount you want up to this maximum: `); 
            if(!isNaN(quarts) && Number(fiveGals) >= 0 || Number(fiveGals) <= maxFiveGallons) break;
            console.log("Incorrect input entered."); 
        }
        tfiveGals += Number(fiveGals);
        gallons -= Number(fiveGals) *5; 
        if(gallons <= 0)
            return [tfiveGals, tgals, tquarts]; 
        else {
            let ans = prompt("You still have some gallons leftover. Continue selecting cans? (Type Y for yes | N for no):");
            if(ans.toUpperCase() !== "Y"){
                return [tfiveGals, tgals, tquarts]; 
            }
        }
    }
}

paintPricePrompt(24433); 

//module.exports = {paintPricePrompt}; 