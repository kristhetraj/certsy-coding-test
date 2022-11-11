document.body.innerHTML = `<div id="container">
<div id="input-container">
  <h3>Input</h3>
  <div><textarea id="commands" rows="10"></textarea></div>
  <div><button id="submit-commands">Submit</button></div>
</div>
<div id="ui-container"></div>
</div>`;

import { sendCommands } from './index';

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
