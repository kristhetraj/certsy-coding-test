import { getCanvas } from './canvas';
import { Commands, Direction, Keys, Orientation, Rotate } from './common';
import { getRobot, PlaceParam } from './robot';
import { getObstruction } from './obstruction';

const getPlaceParam = (command: string, noGridTiles: number): PlaceParam => {
  const placeVals = command.substring(6).split(',');
  const newRobotX = Number.parseInt(placeVals[0]);
  const newRobotY = noGridTiles - 1 - Number.parseInt(placeVals[1]);
  const newOrientation: Orientation =
    Orientation[placeVals[2] as keyof typeof Orientation];
  if (!newOrientation) {
    throw new Error('orientation is not valid');
  }

  return {
    newOrientation,
    newRobotX,
    newRobotY,
  };
};

const getValidCommands = (commandsToRun: string[], noGridTiles: number) => {
  const firstPlaceCommand = commandsToRun.findIndex((command) => {
    if (command.startsWith(Commands.PLACE)) {
      try {
        getPlaceParam(command, noGridTiles);
        return true;
      } catch (e) {
        // no valid place param
      }
    }
  });

  if (firstPlaceCommand < 0) {
    return [];
  }

  // console.log('submit button click', { commandStr, commands });
  const validCommands = commandsToRun.slice(firstPlaceCommand);
  return validCommands;
};

const getState = (params?: Partial<SetupParams>) => {
  const gridSize = params?.gridSize || 50;
  const noGridTiles = params?.noGridTiles || 5;
  const leftWall = params?.leftOffset || 50;
  const topWall = params?.topOffset || 50;

  return {
    gridSize,
    noGridTiles,
    leftWall,
    rightWall: leftWall + noGridTiles * gridSize,
    topWall,
    bottomWall: topWall + noGridTiles * gridSize,
  };
};

interface SetupParams {
  gridSize: number;
  noGridTiles: number;
  leftOffset: number;
  topOffset: number;
}

export const setupRobot = (params?: Partial<SetupParams>) => {
  const { bottomWall, gridSize, leftWall, noGridTiles, rightWall, topWall } =
    getState(params);

  const canvas = getCanvas({
    container: 'ui-container',
    width: 650,
    height: 450,
  });

  canvas.addRectangle({
    x: leftWall,
    y: topWall,
    width: noGridTiles * gridSize,
    height: noGridTiles * gridSize,
    fill: 'green',
  });

  canvas.addText({
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

  const robot = getRobot({
    gridSize,
    leftWall,
    rightWall,
    topWall,
    bottomWall,
    canvas,
  });

  canvas.addUiEventListener('keydown', (e: any) => {
    // console.log(e.keyCode);
    if (e.keyCode === Keys.SPACEBAR) {
      sendCommand(Commands.REPORT);
    } else if (e.keyCode === Keys.LEFT_ARROW) {
      sendCommand(Commands.LEFT);
    } else if (e.keyCode === Keys.UP_ARROW) {
      sendCommand(Commands.MOVE);
    } else if (e.keyCode === Keys.RIGHT_ARROW) {
      sendCommand(Commands.RIGHT);
    } else if (e.keyCode === Keys.DOWN_ARROW) {
      sendCommand(Commands.REVERSE);
    }

    e.preventDefault();
  });

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
      sendCommands(commandsToRun);
    },
    false
  );

  const sendCommand = (command: Commands, params?: PlaceParam) => {
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

  const sendCommands = (commandsToRun: string[]) => {
    const validCommands = getValidCommands(commandsToRun, noGridTiles);

    validCommands.forEach((command) => {
      // console.log('command', { command, activityLogEntries });
      if (command.startsWith(Commands.PLACE)) {
        const placeVals = command.substring(6).split(',');
        if (placeVals.length === 3) {
          try {
            const placeParam = getPlaceParam(command, noGridTiles);
            const activityLogEntry = sendCommand(Commands.PLACE, placeParam);
            addActivityLog(activityLogEntry);
          } catch (e) {
            // ignore bad place command
            // addActivityLog(
            //   `error with PLACE command: ${command}. Must be in format 'PLACE X,Y,F'`
            // );
          }
        }
      } else if (command.startsWith(Commands.MOVE)) {
        const activityLogEntry = sendCommand(Commands.MOVE);
        addActivityLog(activityLogEntry);
      } else if (command.startsWith(Commands.REVERSE)) {
        const activityLogEntry = sendCommand(Commands.REVERSE);
        addActivityLog(activityLogEntry);
      } else if (command.startsWith(Commands.LEFT)) {
        const activityLogEntry = sendCommand(Commands.LEFT);
        addActivityLog(activityLogEntry);
      } else if (command.startsWith(Commands.RIGHT)) {
        const activityLogEntry = sendCommand(Commands.RIGHT);
        addActivityLog(activityLogEntry);
      } else if (command.startsWith(Commands.REPORT)) {
        const activityLogEntry = sendCommand(Commands.REPORT);
        addActivityLog(activityLogEntry);
      }
    });
  };

  return {
    sendCommand,
    sendCommands,
    getActivityLog: () => activityLog,
  };
};

// var obstruction = getObstruction({
//   x: leftWall + gridSize,
//   y: topWall + gridSize,
//   width: gridSize,
//   height: gridSize,
//   canvas,
// });
