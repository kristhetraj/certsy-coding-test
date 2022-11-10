import { orientation, direction, rotate } from './common';

const moveHead = ({ newOrientation, robotHead, robotBody, gridSize }) => {
  switch (newOrientation) {
    case orientation.NORTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() - gridSize / 4);
      break;
    case orientation.SOUTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() + gridSize / 4);
      break;
    case orientation.EAST:
      robotHead.x(robotBody.x() + gridSize / 4);
      robotHead.y(robotBody.y());
      break;
    case orientation.WEST:
      robotHead.x(robotBody.x() - gridSize / 4);
      robotHead.y(robotBody.y());
      break;
  }
  return newOrientation;
};

const rotateRobot = ({
  robotOrientation,
  rotateDirection,
  robotHead,
  robotBody,
  gridSize,
}) => {
  let newOrientation;
  if (
    (robotOrientation === orientation.EAST &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.WEST && rotateDirection === rotate.RIGHT)
  ) {
    newOrientation = orientation.NORTH;
  } else if (
    (robotOrientation === orientation.EAST &&
      rotateDirection === rotate.RIGHT) ||
    (robotOrientation === orientation.WEST && rotateDirection === rotate.LEFT)
  ) {
    newOrientation = orientation.SOUTH;
  } else if (
    (robotOrientation === orientation.SOUTH &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.NORTH && rotateDirection === rotate.RIGHT)
  ) {
    newOrientation = orientation.EAST;
  } else if (
    (robotOrientation === orientation.NORTH &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.SOUTH && rotateDirection === rotate.RIGHT)
  ) {
    newOrientation = orientation.WEST;
  }
  return moveHead({
    newOrientation,
    robotHead,
    robotBody,
    gridSize,
  });
};

const moveRobot = ({
  robotOrientation,
  moveDirection,
  robotBody,
  robotHead,
  gridSize,
  leftWall,
  rightWall,
  topWall,
  bottomWall,
}) => {
  let commandStr =
    moveDirection === direction.FORWARD ? 'move forward: ' : 'move backward: ';

  // move EAST
  if (
    (robotOrientation === orientation.EAST &&
      moveDirection === direction.FORWARD) ||
    (robotOrientation === orientation.WEST &&
      moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x() + gridSize;
    const nextBodyPosY = robotBody.y();
    const wallCheckOkay = nextBodyPosX < rightWall;
    const obstructionCheckOkay = true;

    if (wallCheckOkay && obstructionCheckOkay) {
      robotBody.x(nextBodyPosX);
      robotBody.y(nextBodyPosY);

      robotHead.x(robotHead.x() + gridSize);
      robotHead.y(robotHead.y());
      commandStr += 'success';
    } else {
      commandStr += 'fail';
    }
  }
  // move WEST
  else if (
    (robotOrientation === orientation.WEST &&
      moveDirection === direction.FORWARD) ||
    (robotOrientation === orientation.EAST &&
      moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x() - gridSize;
    const nextBodyPosY = robotBody.y();
    const wallCheckOkay = nextBodyPosX > leftWall;
    const obstructionCheckOkay = true;

    if (wallCheckOkay && obstructionCheckOkay) {
      robotBody.x(nextBodyPosX);
      robotBody.y(nextBodyPosY);

      robotHead.x(robotHead.x() - gridSize);
      robotHead.y(robotHead.y());
      commandStr += 'success';
    } else {
      commandStr += 'fail';
    }
  }
  // move NORTH
  else if (
    (robotOrientation === orientation.NORTH &&
      moveDirection === direction.FORWARD) ||
    (robotOrientation === orientation.SOUTH &&
      moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x();
    const nextBodyPosY = robotBody.y() - gridSize;
    const wallCheckOkay = nextBodyPosY > topWall;
    const obstructionCheckOkay = true;

    if (wallCheckOkay && obstructionCheckOkay) {
      robotBody.x(nextBodyPosX);
      robotBody.y(nextBodyPosY);

      robotHead.x(robotHead.x());
      robotHead.y(robotHead.y() - gridSize);
      commandStr += 'success';
    } else {
      commandStr += 'fail';
    }
  }
  // move SOUTH
  else if (
    (robotOrientation === orientation.SOUTH &&
      moveDirection === direction.FORWARD) ||
    (robotOrientation === orientation.NORTH &&
      moveDirection === direction.BACKWARD)
  ) {
    const nextBodyPosX = robotBody.x();
    const nextBodyPosY = robotBody.y() + gridSize;
    const wallCheckOkay = nextBodyPosY < bottomWall;
    const obstructionCheckOkay = true;

    if (wallCheckOkay && obstructionCheckOkay) {
      robotBody.x(nextBodyPosX);
      robotBody.y(nextBodyPosY);

      robotHead.x(robotHead.x());
      robotHead.y(robotHead.y() + gridSize);
      commandStr += 'success';
    } else {
      commandStr += 'fail';
    }
  }

  return commandStr;
};

export const getRobot = ({
  gridSize,
  leftWall,
  rightWall,
  topWall,
  bottomWall,
  canvas,
}) => {
  const bodyRadius = gridSize / 2;
  const robotBody = canvas.addCircle({
    x: leftWall + gridSize / 2,
    y: topWall + gridSize / 2,
    radius: gridSize / 2,
    fill: 'red',
  });

  const headRadius = (1 / 8) * gridSize;
  const robotHead = canvas.addCircle({
    x: robotBody.x() + gridSize / 4,
    y: robotBody.y(),
    radius: headRadius,
    fill: 'pink',
  });

  let robotOrientation = orientation.EAST;
  return {
    rotate: (rotateDirection) => {
      robotOrientation = rotateRobot({
        robotOrientation,
        rotateDirection,
        robotHead,
        robotBody,
        gridSize,
      });
    },
    move: (moveDirection) => {
      return moveRobot({
        robotOrientation,
        moveDirection,
        robotBody,
        robotHead,
        gridSize,
        leftWall,
        rightWall,
        topWall,
        bottomWall,
      });
    },
    place: ({ newRobotX, newRobotY, newOrientation }) => {
      robotBody.x(leftWall + gridSize / 2 + newRobotX * gridSize);
      robotBody.y(topWall + gridSize / 2 + newRobotY * gridSize);

      robotHead.x(robotBody.x() + gridSize / 4);
      robotHead.y(robotBody.y());

      robotOrientation = moveHead({
        newOrientation,
        gridSize,
        robotBody,
        robotHead,
      });
    },
    getPosition: () => {
      return {
        x: robotBody.x() - leftWall - bodyRadius,
        y: robotBody.y() - topWall - bodyRadius,
        orientation: robotOrientation,
      };
    },
  };
};
