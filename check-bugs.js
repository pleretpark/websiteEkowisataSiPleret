const { exec } = require('child_process');
const fs = require('fs');

exec('npx eslint .', (err, stdout, stderr) => {
  fs.writeFileSync('eslint-output.txt', stdout + '\n' + stderr);
});

exec('npx tsc --noEmit', (err, stdout, stderr) => {
  fs.writeFileSync('tsc-output.txt', stdout + '\n' + stderr);
});

exec('npm run build', (err, stdout, stderr) => {
  fs.writeFileSync('build-output.txt', stdout + '\n' + stderr);
});
