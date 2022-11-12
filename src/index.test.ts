document.body.innerHTML = `<div id="container">
<div id="input-container">
  <h3>Input</h3>
  <div><textarea id="commands" rows="10"></textarea></div>
  <div><button id="submit-commands">Submit</button></div>
</div>
<div id="ui-container"></div>
</div>`;

import { sendCommands } from './index';

describe('generic tests', () => {
  test('first commands', () => {
    const activityLog = sendCommands(['PLACE 0,0,NORTH', 'MOVE', 'REPORT']);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(3);
    expect(activityLog[2]).toBe('report (x: 0, y: 1, orientation: NORTH)');
  });

  test('second commands', () => {
    const activityLog = sendCommands(['PLACE 0,0,NORTH', 'LEFT', 'REPORT']);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(3);
    expect(activityLog[2]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });

  test('third commands', () => {
    const activityLog = sendCommands([
      'PLACE 1,2,EAST',
      'MOVE',
      'MOVE',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(6);
    expect(activityLog[5]).toBe('report (x: 3, y: 3, orientation: NORTH)');
  });

  test('move commands', () => {
    const activityLog = sendCommands([
      'PLACE 0,0,EAST',
      'MOVE',
      'MOVE',
      'MOVE',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 3, y: 0, orientation: EAST)');
  });

  test('reverse commands', () => {
    const activityLog = sendCommands([
      'PLACE 3,0,EAST',
      'REVERSE',
      'REVERSE',
      'REVERSE',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: EAST)');
  });

  test('rotate left commands', () => {
    const activityLog = sendCommands([
      'PLACE 0,0,NORTH',
      'LEFT',
      'LEFT',
      'LEFT',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: EAST)');
  });

  test('rotate right commands', () => {
    const activityLog = sendCommands([
      'PLACE 0,0,NORTH',
      'RIGHT',
      'RIGHT',
      'RIGHT',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(5);
    expect(activityLog[4]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });
});

test('unknown commands', () => {
  const activityLog = sendCommands([
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
  // console.log('activityLog', activityLog);
  expect(activityLog.length).toBe(4);
  expect(activityLog[3]).toBe('report (x: 1, y: 3, orientation: NORTH)');
});

describe('place tests', () => {
  test('commands before place', () => {
    const activityLog = sendCommands([
      'MOVE',
      'MOVE',
      'PLACE 1,2,EAST',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(4);
    expect(activityLog[3]).toBe('report (x: 1, y: 3, orientation: NORTH)');
  });

  test('bad first place command', () => {
    const activityLog = sendCommands(['PLACE 0,0,TEST', 'MOVE', 'REPORT']);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(0);
    // expect(activityLog[2]).toBe('report (x: 0, y: 1, orientation: NORTH)');
  });

  test('bad second place command', () => {
    const activityLog = sendCommands([
      'PLACE 1,2,EAST',
      'MOVE',
      'MOVE',
      'PLACE 1,2,WEAST',
      'LEFT',
      'MOVE',
      'REPORT',
    ]);
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(6);
    expect(activityLog[5]).toBe('report (x: 3, y: 3, orientation: NORTH)');
  });
});

describe('wall tests', () => {
  test('run into south wall', () => {
    const activityLog = sendCommands([
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
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 0, orientation: SOUTH)');
  });

  test('run into east wall', () => {
    const activityLog = sendCommands([
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
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 4, y: 0, orientation: EAST)');
  });

  test('run into north wall', () => {
    const activityLog = sendCommands([
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
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 4, orientation: NORTH)');
  });

  test('run into west wall', () => {
    const activityLog = sendCommands([
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
    // console.log('activityLog', activityLog);
    expect(activityLog.length).toBe(10);
    expect(activityLog[9]).toBe('report (x: 0, y: 0, orientation: WEST)');
  });
});
