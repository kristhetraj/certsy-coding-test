import { Canvas } from './canvas';

interface ObstructionCheckParam {
  nextPosX: number;
  nextPosY: number;
  obstructionX: number;
  obstructionY: number;
  gridSize: number;
}

const getObstructionCheckOkay = ({
  nextPosX,
  nextPosY,
  obstructionX,
  obstructionY,
  gridSize,
}: ObstructionCheckParam) => {
  // const obstructionX = obstruction.x();
  // const obstructionY = obstruction.y();

  const obstructionCheckOkay =
    nextPosX < obstructionX ||
    nextPosX > obstructionX + gridSize ||
    nextPosY < obstructionY ||
    nextPosY > obstructionY + gridSize;

  return obstructionCheckOkay;
};

export interface ObstructionParams {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  canvas: Canvas;
}

export interface CheckParam {
  nextPosX: number;
  nextPosY: number;
}

export interface Obstruction {
  check: (param: CheckParam) => void;
}

export const getObstruction = ({
  x,
  y,
  width,
  height,
  fill = 'blue',
  canvas,
}: ObstructionParams): Obstruction => {
  const obstruction = canvas.addRectangle({
    x,
    y,
    width,
    height,
    fill,
  });
  return {
    check: ({ nextPosX, nextPosY }) => {
      // const doCheck = getObstructionCheckOkay({
      //   nextPosX,
      //   nextPosY,
      //   obstruction,
      // });
    },
  };
};
