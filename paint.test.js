const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

const {paintPricePrompt} = require("./paint"); 

describe("test", () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should present cheapest cost", () => {
        mockInput.mockReturnValueOnce("L").mockReturnValueOnce("F").mockReturnValueOnce("C");
        paintPricePrompt(24433);
        expect(consoleSpy).toHaveBeenCalledWith("You need about 82 gallons of paint. Would you like cheapest estimate or to select you own cans?:");
        expect(consoleSpy).toHaveBeenCalledWith("You need 16 five gallon cans, 2 one gallon cans.");
        expect(consoleSpy).toHaveBeenCalledWith("Price of five gallon cans: $1583.68");
        expect(consoleSpy).toHaveBeenCalledWith("Price of one gallon cans: $43.96");
        expect(consoleSpy).toHaveBeenCalledWith("The total cost is $1627.64");
    });
});