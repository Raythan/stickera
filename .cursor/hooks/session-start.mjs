#!/usr/bin/env node
/** SDD session reminder. stdin: session JSON — stdout optional message. */
process.stdin.resume();
process.stdin.on('end', () => {
  const msg = [
    'Stickera SDD: read AGENTS.md, docs/SDD-DEVELOPMENT.md, docs/PHASES/NN-*.md.',
    'Spec before code. Verify docs/SPEC-VALIDATION.md before done.',
  ].join(' ');
  console.log(JSON.stringify({ continue: true, userMessage: msg }));
});
