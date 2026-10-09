
const fs = require('fs');
const path = require('path');

const essentialFiles = [
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    '.gitignore',
    '.editorconfig',
    'docs/STATUS.md',
    'docs/CHANGELOG.md',
    'docs/adr/0001-resumen-inicial.md',
    'docs/backlog/LF-001.yaml',
    'docs/backlog/LF-002.yaml'
];

let allGood = true;
for (const file of essentialFiles) {
    const fullPath = path.resolve(__dirname, '..', '..', file);
    if (!fs.existsSync(fullPath)) {
        console.error(`Missing essential file: ${file}`);
        allGood = false;
    }
}

if (allGood) {
    console.log('Smoke test passed: all essential files present');
    process.exit(0);
} else {
    process.exit(1);
}
