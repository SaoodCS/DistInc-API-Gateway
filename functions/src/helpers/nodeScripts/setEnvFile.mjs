import fs from 'fs-extra';

const envFileToCopy = process.argv[2];

const filePath = '.env';
fs.removeSync(filePath);
console.log('Deleted old .env file...');

fs.copyFileSync(envFileToCopy, filePath);
console.log('Created new .env file...');
