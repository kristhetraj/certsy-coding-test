import { addRectangle } from './ui';

const getObstructionCheckOkay = ({ nextPosX, nextPosY, obstruction }) => {
  const obstructionX = obstruction.x();
  const obstructionY = obstruction.y();

  const obstructionCheckOkay =
    nextPosX < obstructionX ||
    nextPosX > obstructionX + gridSize ||
    nextPosY < obstructionY ||
    nextPosY > obstructionY + gridSize;

  return obstructionCheckOkay;
};

export const getObstruction = ({ x, y, width, height, fill = 'blue' }) => {
  const obstruction = addRectangle({
    x,
    y,
    width,
    height,
    fill,
  });
  return {
    check: ({ nextPosX, nextPosY }) => {
      const doCheck = getObstructionCheckOkay({
        nextPosX,
        nextPosY,
        obstruction,
      });
    },
  };
};
