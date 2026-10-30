import { test } from 'node:test';
import assert from 'node:assert/strict';
import { propertiesLine, gradient, motdSpans, stripCodes, centerMotdText } from '../src/motd.js';

test('properties export preserves two lines, Unicode, backslashes and blocks extra settings', () => {
  assert.equal(propertiesLine('§aHi\nWorld\nonline-mode=false'), 'motd=\\u00a7aHi\\nWorld');
  assert.equal(propertiesLine('a\\n😀'), 'motd=a\\\\n\\ud83d\\ude00');
});
test('gradients retain text and use the selected endpoint colors', () => {
  const spans = motdSpans(gradient('Hi', '#ff0000', '#0000ff'));
  assert.equal(spans.map(s => s.text).join(''), 'Hi');
  assert.equal(spans[0].style.color, '#ff0000');
  assert.equal(spans[1].style.color, '#0000ff');
});
test('color and reset codes end previous text formatting', () => {
  const spans = motdSpans('§lBold§aGreen§rPlain');
  assert.equal(spans[0].style.fontWeight, 'bold');
  assert.equal(spans[1].style.fontWeight, undefined);
  assert.equal(spans[2].style.color, '#aaaaaa');
});
test('stripCodes and centerMotdText ignore formatting codes when calculating visible width', () => {
  assert.equal(stripCodes('§a§lHello §x§f§f§0§0§0§0World'), 'Hello World');
  const centered = centerMotdText('§a§lHi', 10);
  assert.equal(centered, '    §a§lHi');
});
