const { spawnSync } = require('child_process');

const result = spawnSync('next build', {
  shell: true,
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_BUILD: '1',
    NEXT_PUBLIC_ELECTRON: '1',
  },
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
