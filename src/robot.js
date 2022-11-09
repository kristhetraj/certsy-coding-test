import { addCircle } from './ui';
import { orientation, direction, rotate } from './common';

const rotateRobot = ({
  robotOrientation,
  rotateDirection,
  robotHead,
  robotBody,
  gridSize,
}) => {
  if (
    (robotOrientation === orientation.EAST &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.WEST && rotateDirection === rotate.RIGHT)
  ) {
    robotHead.x(robotBody.x());
    robotHead.y(robotBody.y() - gridSize / 4);
    return orientation.NORTH;
  } else if (
    (robotOrientation === orientation.EAST &&
      rotateDirection === rotate.RIGHT) ||
    (robotOrientation === orientation.WEST && rotateDirection === rotate.LEFT)
  ) {
    robotHead.x(robotBody.x());
    robotHead.y(robotBody.y() + gridSize / 4);
    return orientation.SOUTH;
  } else if (
    (robotOrientation === orientation.SOUTH &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.NORTH && rotateDirection === rotate.RIGHT)
  ) {
    robotHead.x(robotBody.x() + gridSize / 4);
    robotHead.y(robotBody.y());
    return orientation.EAST;
  } else if (
    (robotOrientation === orientation.NORTH &&
      rotateDirection === rotate.LEFT) ||
    (robotOrientation === orientation.SOUTH && rotateDirection === rotate.RIGHT)
  ) {
    robotHead.x(robotBody.x() - gridSize / 4);
    robotHead.y(robotBody.y());
    return orientation.WEST;
  }
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
}) => {
  const bodyRadius = gridSize / 2;
  const robotBody = addCircle({
    x: leftWall + gridSize / 2,
    y: topWall + gridSize / 2,
    radius: gridSize / 2,
    fill: 'red',
  });

  const headRadius = (1 / 8) * gridSize;
  const robotHead = addCircle({
    x: robotBody.x() + gridSize / 4,
    y: robotBody.y(),
    radius: headRadius,
    fill: 'pink',
  });

  let robotOrientation = orientation.EAST;
  return {
    rotateLeft: () => {
      robotOrientation = rotateRobot({
        robotOrientation,
        rotateDirection: rotate.LEFT,
        robotHead,
        robotBody,
        gridSize,
      });
    },
    rotateRight: () => {
      robotOrientation = rotateRobot({
        robotOrientation,
        rotateDirection: rotate.RIGHT,
        robotHead,
        robotBody,
        gridSize,
      });
    },
    sendRobotMove: (moveDirection) => {
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
    getPosition: () => {
      return {
        x: robotBody.x() - leftWall - bodyRadius,
        y: robotBody.y() - topWall - bodyRadius,
        orientation: robotOrientation,
      };
    },
  };
};
