import { Circle } from 'konva/lib/shapes/Circle';
import { Canvas } from './canvas';
import { Orientation, Direction, Rotate } from './common';

interface MoveHeadParam {
  newOrientation: Orientation;
  robotHead: Circle;
  robotBody: Circle;
  gridSize: number;
}

const moveHead = ({
  newOrientation,
  robotHead,
  robotBody,
  gridSize,
}: MoveHeadParam) => {
  switch (newOrientation) {
    case Orientation.NORTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() - gridSize / 4);
      break;
    case Orientation.SOUTH:
      robotHead.x(robotBody.x());
      robotHead.y(robotBody.y() + gridSize / 4);
      break;
    case Orientation.EAST:
      robotHead.x(robotBody.x() + gridSize / 4);
      robotHead.y(robotBody.y());
      break;
    case Orientation.WEST:
      robotHead.x(robotBody.x() - gridSize / 4);
      robotHead.y(robotBody.y());
      break;
  }
  return newOrientation;
};

interface RotateRobotParam {
  robotOrientation: Orientation;
  rotateDirection: Rotate;
  robotHead: Circle;
  robotBody: Circle;
  gridSize: number;
}

const rotateRobot = ({
  robotOrientation,
  rotateDirection,
  robotHead,
  robotBody,
  gridSize,
}: RotateRobotParam) => {
  let newOrientation;
  if (
    (robotOrientation === Orientation.EAST &&
      rotateDirection === Rotate.LEFT) ||
    (robotOrientation === Orientation.WEST && rotateDirection === Rotate.RIGHT)
  ) {
    newOrientation = Orientation.NORTH;
  } else if (
    (robotOrientation === Orientation.EAST &&
      rotateDirection === Rotate.RIGHT) ||
    (robotOrientation === Orientation.WEST && rotateDirection === Rotate.LEFT)
  ) {
    newOrientation = Orientation.SOUTH;
  } else if (
    (robotOrientation === Orientation.SOUTH &&
      rotateDirection === Rotate.LEFT) ||
    (robotOrientation === Orientation.NORTH && rotateDirection === Rotate.RIGHT)
  ) {
    newOrientation = Orientation.EAST;
  } else if (
    (robotOrientation === Orientation.NORTH &&
      rotateDirection === Rotate.LEFT) ||
    (robotOrientation === Orientation.SOUTH && rotateDirection === Rotate.RIGHT)
  ) {
    newOrientation = Orientation.WEST;
  }
  return moveHead({
    newOrientation,
    robotHead,
    robotBody,
    gridSize,
  });
};

interface MoveRobotParam {
  robotOrientation: Orientation;
  moveDirection: Direction;
  robotBody: Circle;
  robotHead: Circle;
  gridSize: number;
  leftWall: number;
  rightWall: number;
  topWall: number;
  bottomWall: number;
}

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
}: MoveRobotParam) => {
  let commandStr =
    moveDirection === Direction.FORWARD ? 'move forward: ' : 'move backward: ';

  // move EAST
  if (
    (robotOrientation === Orientation.EAST &&
      moveDirection === Direction.FORWARD) ||
    (robotOrientation === Orientation.WEST &&
      moveDirection === Direction.BACKWARD)
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
    (robotOrientation === Orientation.WEST &&
      moveDirection === Direction.FORWARD) ||
    (robotOrientation === Orientation.EAST &&
      moveDirection === Direction.BACKWARD)
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
    (robotOrientation === Orientation.NORTH &&
      moveDirection === Direction.FORWARD) ||
    (robotOrientation === Orientation.SOUTH &&
      moveDirection === Direction.BACKWARD)
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
    (robotOrientation === Orientation.SOUTH &&
      moveDirection === Direction.FORWARD) ||
    (robotOrientation === Orientation.NORTH &&
      moveDirection === Direction.BACKWARD)
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

export interface RobotParam {
  gridSize: number;
  leftWall: number;
  rightWall: number;
  topWall: number;
  bottomWall: number;
  canvas: Canvas;
}

export interface PlaceParam {
  newRobotX: number;
  newRobotY: number;
  newOrientation: Orientation;
}

export const getRobot = ({
  gridSize,
  leftWall,
  rightWall,
  topWall,
  bottomWall,
  canvas,
}: RobotParam) => {
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

  let robotOrientation = Orientation.EAST;
  return {
    rotate: (rotateDirection: Rotate) => {
      robotOrientation = rotateRobot({
        robotOrientation,
        rotateDirection,
        robotHead,
        robotBody,
        gridSize,
      });
    },
    move: (moveDirection: Direction) => {
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
    place: ({ newRobotX, newRobotY, newOrientation }: PlaceParam) => {
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
