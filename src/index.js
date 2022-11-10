import { getCanvas } from './ui';
import { direction, rotate } from './common';
import { getRobot } from './robot';
import { getObstruction } from './obstruction';

const gridSize = 50;
const noGridTiles = 5;

const leftWall = 50;
const rightWall = leftWall + noGridTiles * gridSize;
const topWall = 50;
const bottomWall = topWall + noGridTiles * gridSize;

const canvas = getCanvas({
  container: 'ui-container',
  width: 650,
  height: 450,
});

var instructionText = canvas.addText({
  x: rightWall,
  y: topWall - 50,
  text: '[Instructions]\n\nTop arrow = forward\nBack arrow = backward\nLeft arrow = rotate left\nRight arrow = rotate right\nSpace bar = Report',
});

var activityLogText = canvas.addText({
  x: rightWall,
  y: topWall + 100,
  text: '[Activity Log]\n\n',
});

const activityLog = [];
const addActivityLog = (activityLogEntry) => {
  activityLog.push(activityLogEntry);
  // console.log('commands', commands);
  const activityLogStr = activityLog
    .slice(activityLog.length - Math.min(10, activityLog.length))
    .reduce((acc, curr) => {
      return `${acc}\n${curr}`;
    }, '[Activity Log]\n\n');
  activityLogText.text(activityLogStr);
};

var table = canvas.addRectangle({
  x: leftWall,
  y: topWall,
  width: noGridTiles * gridSize,
  height: noGridTiles * gridSize,
  fill: 'green',
});

// var obstruction = getObstruction({
//   x: leftWall + gridSize,
//   y: topWall + gridSize,
//   width: gridSize,
//   height: gridSize,
// });

const robot = getRobot({
  gridSize,
  leftWall,
  rightWall,
  topWall,
  bottomWall,
  canvas,
});

const keys = {
  SPACEBAR: 32,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
};

const commands = {
  PLACE: 'PLACE',
  MOVE: 'MOVE',
  REVERSE: 'REVERSE',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  REPORT: 'REPORT',
};

canvas.addUiEventListener('keydown', (e) => {
  // console.log(e.keyCode);
  if (e.keyCode === keys.SPACEBAR) {
    sendCommand(commands.REPORT);
  }
  if (e.keyCode === keys.LEFT_ARROW) {
    sendCommand(commands.LEFT);
  } else if (e.keyCode === keys.UP_ARROW) {
    sendCommand(commands.MOVE);
  } else if (e.keyCode === keys.RIGHT_ARROW) {
    sendCommand(commands.RIGHT);
  } else if (e.keyCode === keys.DOWN_ARROW) {
    sendCommand(commands.REVERSE);
  } else {
    return;
  }

  e.preventDefault();
});

const sendCommand = (command, params) => {
  switch (command) {
    case commands.PLACE:
      addActivityLog(
        `place (x: ${params.newRobotX}, y: ${params.newRobotY}, orientation: ${params.newOrientation})`
      );
      robot.place(params);
      break;
    case commands.MOVE:
      const activityLogEntry = robot.move(direction.FORWARD);
      addActivityLog(activityLogEntry);
      break;
    case commands.REVERSE:
      const activityLogEntry2 = robot.move(direction.BACKWARD);
      addActivityLog(activityLogEntry2);
      break;
    case commands.LEFT:
      addActivityLog('rotate left');
      robot.rotate(rotate.LEFT);
      break;
    case commands.RIGHT:
      addActivityLog('rotate right');
      robot.rotate(rotate.RIGHT);
      break;
    case commands.REPORT:
      const robotPosition = robot.getPosition();
      addActivityLog(
        `report (x: ${robotPosition.x / gridSize}, y:${
          noGridTiles - 1 - robotPosition.y / gridSize
        }, orientation: ${robotPosition.orientation})`
      );
      break;
  }
};

const elements = {
  commands: document.getElementById('commands'),
  submitCommands: document.getElementById('submit-commands'),
};

elements.submitCommands.addEventListener(
  'click',
  () => {
    // console.log('submit button click', elements.commands.value);
    const commandStr = elements.commands.value;
    const commandsToRun = commandStr.split('\n');

    const firstPlaceCommand = commandsToRun.findIndex((command) => {
      return command.startsWith(commands.PLACE);
    });

    if (firstPlaceCommand < 0) {
      return;
    }

    // console.log('submit button click', { commandStr, commands });
    commandsToRun.slice(firstPlaceCommand).forEach((command) => {
      // console.log('command', command);
      if (command.startsWith(commands.PLACE)) {
        const placeVals = command.substring(6).split(',');
        sendCommand(commands.PLACE, {
          newRobotX: placeVals[0],
          newRobotY: noGridTiles - 1 - placeVals[1],
          newOrientation: placeVals[2],
        });
      } else if (command.startsWith(commands.MOVE)) {
        sendCommand(commands.MOVE);
      } else if (command.startsWith(commands.REVERSE)) {
        sendCommand(commands.REVERSE);
      } else if (command.startsWith(commands.LEFT)) {
        sendCommand(commands.LEFT);
      } else if (command.startsWith(commands.RIGHT)) {
        sendCommand(commands.RIGHT);
      } else if (command.startsWith(commands.REPORT)) {
        sendCommand(commands.REPORT);
      }
    });
  },
  false
);
