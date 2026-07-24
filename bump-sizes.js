const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'admin');

const sizeMap = {
    'text-xs': 'text-sm',
    'text-sm': 'text-base',
    'text-base': 'text-lg',
    'text-lg': 'text-xl',
    'text-xl': 'text-2xl',
    'text-2xl': 'text-3xl',
    'text-3xl': 'text-4xl',
    'text-4xl': 'text-5xl',
    'text-5xl': 'text-6xl'
};

function bumpSizesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const regex = /(?<=^|['"\s`:])text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)(?=$|['"\s`])/g;
    
    const newContent = content.replace(regex, (match) => {
        return sizeMap[match] || match;
    });

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated sizes in: ${filePath}`);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            bumpSizesInFile(fullPath);
        }
    }
}

processDirectory(dir);
console.log('Finished bumping text sizes.');
