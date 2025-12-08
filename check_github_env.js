const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log("Checking GitHub Env Vars:");
console.log("GITHUB_ID exists:", !!process.env.GITHUB_ID);
console.log("GITHUB_SECRET exists:", !!process.env.GITHUB_SECRET);
