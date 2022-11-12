document.body.innerHTML = `<div id="container">
<div id="input-container">
  <h3>Input</h3>
  <div><textarea id="commands" rows="10"></textarea></div>
  <div><button id="submit-commands">Submit</button></div>
</div>
<div id="ui-container"></div>
</div>`;

import { setupRobot } from './index';

describe('generic tests', () => {
  test('first commands', () => {
    const robot = setupRobot();
    robot.sendCommands(['PLACE 0,0,NORTH', 'MOVE', 'REPORT']);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(3);
    expect(activityLog[2]).toBe('report (x: 0, y: 1, orientation: NORTH)');
  });

  test('second commands', () => {
    const robot = setupRobot();
    robot.sendCommands(['PLACE 0,0,NORTH', 'LEFT', 'REPORT']);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(3);
    expect(activityLog[2]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });

  test('third commands', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 1,2,EAST',
      'MOVE',
      'MOVE',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(6);
    expect(activityLog[5]).toBe('report (x: 3, y: 3, orientation: NORTH)');
  });

  test('move commands', () => {
    const robot = setupRobot();
    robot.sendCommands(['PLACE 0,0,EAST', 'MOVE', 'MOVE', 'MOVE', 'REPORT']);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 3, y: 0, orientation: EAST)');
  });

  test('reverse commands', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 3,0,EAST',
      'REVERSE',
      'REVERSE',
      'REVERSE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: EAST)');
  });

  test('rotate left commands', () => {
    const robot = setupRobot();
    robot.sendCommands(['PLACE 0,0,NORTH', 'LEFT', 'LEFT', 'LEFT', 'REPORT']);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: EAST)');
  });

  test('rotate right commands', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'RIGHT',
      'RIGHT',
      'RIGHT',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });
});

test('unknown commands', () => {
  const robot = setupRobot();
  robot.sendCommands([
    'MOVE',
    'MOVE',
    'FAKE',
    'PLACE 1,2,EAST',
    'GO',
    'LEFT',
    'MOVE',
    'COMMAND',
    'REPORT',
  ]);
  const activityLog = robot.getActivityLog();
  expect(activityLog.length).toBe(4);
  expect(activityLog[3]).toBe('report (x: 1, y: 3, orientation: NORTH)');
});

describe('place tests', () => {
  test('commands before place', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'MOVE',
      'MOVE',
      'PLACE 1,2,EAST',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(4);
    expect(activityLog[3]).toBe('report (x: 1, y: 3, orientation: NORTH)');
  });

  test('bad first place command', () => {
    const robot = setupRobot();
    robot.sendCommands(['PLACE 0,0,TEST', 'MOVE', 'REPORT']);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(0);
    // expect(activityLog[2]).toBe('report (x: 0, y: 1, orientation: NORTH)');
  });

  test('bad second place command', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 1,2,EAST',
      'MOVE',
      'MOVE',
      'PLACE 1,2,WEAST',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(6);
    expect(activityLog[5]).toBe('report (x: 3, y: 3, orientation: NORTH)');
  });
});

describe('wall tests', () => {
  test('run into south wall', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,SOUTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 0, orientation: SOUTH)');
  });

  test('run into east wall', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 4, y: 0, orientation: EAST)');
  });

  test('run into north wall', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 4, orientation: NORTH)');
  });

  test('run into west wall', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,WEST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });
});

describe('grid size tests', () => {
  test('5x5 move east', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(7);
    expect(activityLog[6]).toBe('report (x: 4, y: 0, orientation: EAST)');
  });

  test('5x5 move east - extra move', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(8);
    expect(activityLog[7]).toBe('report (x: 4, y: 0, orientation: EAST)');
  });

  test('5x5 move north', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(7);
    expect(activityLog[6]).toBe('report (x: 0, y: 4, orientation: NORTH)');
  });

  test('5x5 move north - extra move', () => {
    const robot = setupRobot();
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(8);
    expect(activityLog[7]).toBe('report (x: 0, y: 4, orientation: NORTH)');
  });

  test('10x10 move east', () => {
    const robot = setupRobot({
      noGridTiles: 10,
    });
    robot.sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(12);
    expect(activityLog[11]).toBe('report (x: 9, y: 0, orientation: EAST)');
  });

  test('10x10 move east - extra move', () => {
    const robot = setupRobot({
      noGridTiles: 10,
    });
    robot.sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(13);
    expect(activityLog[12]).toBe('report (x: 9, y: 0, orientation: EAST)');
  });

  test('10x10 move north', () => {
    const robot = setupRobot({
      noGridTiles: 10,
    });
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(12);
    expect(activityLog[11]).toBe('report (x: 0, y: 9, orientation: NORTH)');
  });

  test('10x10 move north - extra move', () => {
    const robot = setupRobot({
      noGridTiles: 10,
    });
    robot.sendCommands([
      'PLACE 0,0,NORTH',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    const activityLog = robot.getActivityLog();
    expect(activityLog.length).toBe(13);
    expect(activityLog[12]).toBe('report (x: 0, y: 9, orientation: NORTH)');
  });
});
