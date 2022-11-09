import { addText, addRectangle, addUiEventListener } from './ui';
import { direction } from './common';
import { getRobot } from './robot';
import { getObstruction } from './obstruction';

const gridSize = 50;
const noGridTiles = 6;

const leftWall = 100;
const rightWall = leftWall + noGridTiles * gridSize;
const topWall = 100;
const bottomWall = topWall + noGridTiles * gridSize;

var instructionText = addText({
  x: rightWall,
  y: topWall - 50,
  text: '[Instructions]\n\nTop arrow = forward\nBack arrow = backward\nLeft arrow = rotate left\nRight arrow = rotate right\nSpace bar = Report',
});

var commandText = addText({
  x: rightWall,
  y: topWall + 100,
  text: '[Commands]\n\n',
});

const commands = [];
const addCommand = (command) => {
  commands.push(command);
  // console.log('commands', commands);
  const commandTextStr = commands
    .slice(commands.length - Math.min(10, commands.length))
    .reduce((acc, curr) => {
      return `${acc}\n${curr}`;
    }, '[Commands]\n\n');
  commandText.text(commandTextStr);
};

var table = addRectangle({
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
});

const keys = {
  SPACEBAR: 32,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
};

addUiEventListener('keydown', (e) => {
  // console.log(e.keyCode);
  if (e.keyCode === keys.SPACEBAR) {
    const robotPosition = robot.getPosition();
    addCommand(
      `direction: ${robotPosition.orientation}, x: ${robotPosition.x}, y:${robotPosition.y}`
    );
  }
  if (e.keyCode === keys.LEFT_ARROW) {
    addCommand('rotate left');
    robot.rotateLeft();
  } else if (e.keyCode === keys.UP_ARROW) {
    const command = robot.sendRobotMove(direction.FORWARD);
    addCommand(command);
  } else if (e.keyCode === keys.RIGHT_ARROW) {
    addCommand('rotate right');
    robot.rotateRight();
  } else if (e.keyCode === keys.DOWN_ARROW) {
    const command = robot.sendRobotMove(direction.BACKWARD);
    addCommand(command);
  } else {
    return;
  }
  e.preventDefault();
});
