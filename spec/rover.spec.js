const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

it("constructor sets position and default values for mode and generatorWatts", function () {
        let testRover = new Rover(111)
        expect(testRover.position).toEqual(111)
        expect(testRover.generatorWatts).toEqual(110)
    });

    it("response returned by receiveMessage contains name of message", function () {
        let testMsg = new Message("TEST", [])
        let testRover = new Rover(111)
        expect(testRover.receiveMessage(testMsg).message).toEqual(testMsg.name)
    });

    it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
        let testMsg = new Message("TEST", [new Command('STATUS_CHECK', ''), new Command('STATUS_CHECK', '')])
        let testRover = new Rover(111);
        expect(testMsg.commands.length).toEqual(testRover.receiveMessage(testMsg).results.length)
    });

    it("responds correctly to status check command", function () {
        let testRover = new Rover(111)
        let testMsg = new Message("TEST", [new Command('STATUS_CHECK', '')])
        expect(testRover.receiveMessage(testMsg).results).toContain(jasmine.objectContaining({
            roverStatus: {
                mode: testRover.mode,
                generatorWatts: testRover.generatorWatts,
                position: testRover.position
            }
        }))
    });

    it("responds correctly to mode change command", function () {
        let testRover = new Rover(111)
        let testMsgLowPower = new Message("LowPower", [new Command('MODE_CHANGE', 'LOW_POWER')])
        expect(testRover.receiveMessage(testMsgLowPower).results[0].completed).toBeTrue()
        expect(testRover.mode).toEqual('LOW_POWER')
    });

    it('responds with false completed value when attempting to move in LOW_POWER mode', function () {
        let testRover = new Rover(111)
        testRover.mode = 'LOW_POWER'
        let testMsgMoveLowPower = new Message("Move", [new Command('MOVE', 555)])
        expect(testRover.receiveMessage(testMsgMoveLowPower).results[0].completed).toBeFalse()
    });

    it('responds with position for move command', function () {
        let testRover = new Rover(111)
        let testMsgMove = new Message("Move", [new Command('MOVE', 555)])
        testRover.receiveMessage(testMsgMove)
        expect(testRover.position).toEqual(testMsgMove.commands[0].value)
    });
});
