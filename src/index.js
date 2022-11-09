import { addText, addRectangle, addCircle, addUiEventListener } from './ui';

const gridSize = 50;

const leftWall = 100;
const topWall = 100;
const noGridTiles = 6;
const rightWall = leftWall + noGridTiles * gridSize;
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

var obstruction = addRectangle({
  x: leftWall + gridSize,
  y: topWall + gridSize,
  width: gridSize,
  height: gridSize,
  fill: 'blue',
});

const bodyRadius = gridSize / 2;
var robotBody = addCircle({
  x: leftWall + gridSize / 2,
  y: topWall + gridSize / 2,
  radius: gridSize / 2,
  fill: 'red',
});

const headRadius = (1 / 8) * gridSize;
var robotHead = addCircle({
  x: robotBody.x() + gridSize / 4,
  y: robotBody.y(),
  radius: headRadius,
  fill: 'pink',
});

const orentation = {
  EAST: 'EAST',
  WEST: 'WEST',
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
};

const direction = {
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
};

let orientation = orentation.EAST;
const moveHeadDirection = (newOrientation) => {
  orientation = newOrientation;
  switch (orientation) {
    case orentation.EAST:
      robotHead.x(robotBody.x() + gridSize / 4);
      robotHead.y(robotBody.y());
      break;
    case orentation.WEST:
      robotHead.x(robotBody.x() - gridSize / 4);
      robotHead.y(robotBody.y());
      break;
    case orentation.NORTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() - gridSize / 4);
      break;
    case orentation.SOUTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() + gridSize / 4);
      break;
  }
};

const getObstructionCheckOkay = (nextBodyPosX, nextBodyPosY) => {
  const obstructionX = obstruction.x();
  const obstructionY = obstruction.y();

  const obstructionCheckOkay =
    nextBodyPosX < obstructionX ||
    nextBodyPosX > obstructionX + gridSize ||
    nextBodyPosY < obstructionY ||
    nextBodyPosY > obstructionY + gridSize;

  return obstructionCheckOkay;
};

const attemptRobotMove = ({
  wallCheckOkay,
  nextBodyPosX,
  nextBodyPosY,
  nextHeadPosX,
  nextHeadPosY,
}) => {
  const obstructionCheckOkay = getObstructionCheckOkay(
    nextBodyPosX,
    nextBodyPosY
  );
  if (wallCheckOkay && obstructionCheckOkay) {
    robotBody.x(nextBodyPosX);
    robotBody.y(nextBodyPosY);

    robotHead.x(nextHeadPosX);
    robotHead.y(nextHeadPosY);
    return 'success';
  }
  return 'fail';
};

const sendRobotMove = (moveDirection = direction.FORWARD) => {
  let commandStr = '';
  if (moveDirection === direction.FORWARD) {
    commandStr += 'move forward: ';
  } else {
    commandStr += 'move backward: ';
  }

  // move EAST
  if (
    (orientation === orentation.EAST && moveDirection === direction.FORWARD) ||
    (orientation === orentation.WEST && moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x() + gridSize;
    const nextBodyPosY = robotBody.y();
    const wallCheckOkay = nextBodyPosX < rightWall;
    commandStr += attemptRobotMove({
      wallCheckOkay,
      nextBodyPosX,
      nextBodyPosY,
      nextHeadPosX: robotHead.x() + gridSize,
      nextHeadPosY: robotHead.y(),
    });
  }
  // move WEST
  else if (
    (orientation === orentation.WEST && moveDirection === direction.FORWARD) ||
    (orientation === orentation.EAST && moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x() - gridSize;
    const nextBodyPosY = robotBody.y();
    const wallCheckOkay = nextBodyPosX > leftWall;

    commandStr += attemptRobotMove({
      wallCheckOkay,
      nextBodyPosX,
      nextBodyPosY,
      nextHeadPosX: robotHead.x() - gridSize,
      nextHeadPosY: robotHead.y(),
    });
  }
  // move NORTH
  else if (
    (orientation === orentation.NORTH && moveDirection === direction.FORWARD) ||
    (orientation === orentation.SOUTH && moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x();
    const nextBodyPosY = robotBody.y() - gridSize;
    const wallCheckOkay = nextBodyPosY > topWall;

    commandStr += attemptRobotMove({
      wallCheckOkay,
      nextBodyPosX,
      nextBodyPosY,
      nextHeadPosX: robotHead.x(),
      nextHeadPosY: robotHead.y() - gridSize,
    });
  }
  // move SOUTH
  else if (
    (orientation === orentation.SOUTH && moveDirection === direction.FORWARD) ||
    (orientation === orentation.NORTH && moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x();
    const nextBodyPosY = robotBody.y() + gridSize;
    const wallCheckOkay = nextBodyPosY < bottomWall;

    commandStr += attemptRobotMove({
      wallCheckOkay,
      nextBodyPosX,
      nextBodyPosY,
      nextHeadPosX: robotHead.x(),
      nextHeadPosY: robotHead.y() + gridSize,
    });
  }

  addCommand(commandStr);
};

const rotateLeft = () => {
  switch (orientation) {
    case orentation.EAST:
      moveHeadDirection(orentation.NORTH);
      break;
    case orentation.WEST:
      moveHeadDirection(orentation.SOUTH);
      break;
    case orentation.NORTH:
      moveHeadDirection(orentation.WEST);
      break;
    case orentation.SOUTH:
      moveHeadDirection(orentation.EAST);
      break;
  }
};

const rotateRight = () => {
  switch (orientation) {
    case orentation.EAST:
      moveHeadDirection(orentation.SOUTH);
      break;
    case orentation.WEST:
      moveHeadDirection(orentation.NORTH);
      break;
    case orentation.NORTH:
      moveHeadDirection(orentation.EAST);
      break;
    case orentation.SOUTH:
      moveHeadDirection(orentation.WEST);
      break;
  }
};

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
    addCommand(
      `direction: ${orientation}, x: ${
        robotBody.x() - leftWall - bodyRadius
      }, y:${robotBody.y() - topWall - bodyRadius}`
    );
  }
  if (e.keyCode === keys.LEFT_ARROW) {
    addCommand('rotate left');
    rotateLeft();
  } else if (e.keyCode === keys.UP_ARROW) {
    sendRobotMove();
  } else if (e.keyCode === keys.RIGHT_ARROW) {
    addCommand('rotate right');
    rotateRight();
  } else if (e.keyCode === keys.DOWN_ARROW) {
    sendRobotMove(direction.BACKWARD);
  } else {
    return;
  }
  e.preventDefault();
});
