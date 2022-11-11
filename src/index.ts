import { getCanvas } from './canvas';
import { Direction, Orientation, Rotate } from './common';
import { getRobot, PlaceParam } from './robot';
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

const activityLog: string[] = [];
const addActivityLog = (activityLogEntry: string) => {
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
//   canvas,
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

enum Commands {
  PLACE = 'PLACE',
  MOVE = 'MOVE',
  REVERSE = 'REVERSE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  REPORT = 'REPORT',
}

canvas.addUiEventListener('keydown', (e: any) => {
  // console.log(e.keyCode);
  if (e.keyCode === keys.SPACEBAR) {
    sendCommand(Commands.REPORT);
  } else if (e.keyCode === keys.LEFT_ARROW) {
    sendCommand(Commands.LEFT);
  } else if (e.keyCode === keys.UP_ARROW) {
    sendCommand(Commands.MOVE);
  } else if (e.keyCode === keys.RIGHT_ARROW) {
    sendCommand(Commands.RIGHT);
  } else if (e.keyCode === keys.DOWN_ARROW) {
    sendCommand(Commands.REVERSE);
  }

  e.preventDefault();
});

export const sendCommand = (command: Commands, params?: PlaceParam) => {
  switch (command) {
    case Commands.PLACE:
      robot.place(params);
      return `place (x: ${params.newRobotX}, y: ${
        noGridTiles - 1 - params.newRobotY
      }, orientation: ${params.newOrientation})`;
    case Commands.MOVE:
      return robot.move(Direction.FORWARD);
    case Commands.REVERSE:
      return robot.move(Direction.BACKWARD);
    case Commands.LEFT:
      robot.rotate(Rotate.LEFT);
      return 'rotate left';
    case Commands.RIGHT:
      robot.rotate(Rotate.RIGHT);
      return 'rotate right';
    case Commands.REPORT:
      const robotPosition = robot.getPosition();
      return `report (x: ${robotPosition.x / gridSize}, y: ${
        noGridTiles - 1 - robotPosition.y / gridSize
      }, orientation: ${robotPosition.orientation})`;
  }
};

export const sendCommands = (commands: string[]) => {
  const activityLogEntries: string[] = [];
  commands.forEach((command) => {
    // console.log('command', { command, activityLogEntries });
    if (command.startsWith(Commands.PLACE)) {
      const placeVals = command.substring(6).split(',');
      const activityLogEntry = sendCommand(Commands.PLACE, {
        newRobotX: Number.parseInt(placeVals[0]),
        newRobotY: noGridTiles - 1 - Number.parseInt(placeVals[1]),
        newOrientation: placeVals[2] as Orientation,
      });
      activityLogEntries.push(activityLogEntry);
    } else if (command.startsWith(Commands.MOVE)) {
      const activityLogEntry = sendCommand(Commands.MOVE);
      activityLogEntries.push(activityLogEntry);
    } else if (command.startsWith(Commands.REVERSE)) {
      const activityLogEntry = sendCommand(Commands.REVERSE);
      activityLogEntries.push(activityLogEntry);
    } else if (command.startsWith(Commands.LEFT)) {
      const activityLogEntry = sendCommand(Commands.LEFT);
      activityLogEntries.push(activityLogEntry);
    } else if (command.startsWith(Commands.RIGHT)) {
      const activityLogEntry = sendCommand(Commands.RIGHT);
      activityLogEntries.push(activityLogEntry);
    } else if (command.startsWith(Commands.REPORT)) {
      const activityLogEntry = sendCommand(Commands.REPORT);
      activityLogEntries.push(activityLogEntry);
    }
  });

  activityLogEntries.forEach((activityLogEntry) => {
    addActivityLog(activityLogEntry);
  });

  return activityLogEntries;
};

const elements = {
  commands: document.getElementById('commands') as HTMLTextAreaElement,
  submitCommands: document.getElementById(
    'submit-commands'
  ) as HTMLButtonElement,
};

elements.submitCommands.addEventListener(
  'click',
  () => {
    // console.log('submit button click', elements.commands.value);
    const commandStr = elements.commands.value;
    const commandsToRun = commandStr.split('\n');

    const firstPlaceCommand = commandsToRun.findIndex((command) => {
      return command.startsWith(Commands.PLACE);
    });

    if (firstPlaceCommand < 0) {
      return;
    }

    // console.log('submit button click', { commandStr, commands });
    const validCommands = commandsToRun.slice(firstPlaceCommand);
    sendCommands(validCommands);
  },
  false
);
