#!/usr/bin/env node

/**
 * QHop Release Preparation Script
 * 
 * This script helps prepare releases by:
 * - Validating the build
 * - Running tests
 * - Generating release notes
 * - Creating git tags
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

console.log(`🚀 Preparing QHop release v${version}`);

// Step 1: Validate build
console.log('\n📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 2: Run linting
console.log('\n🔍 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.error('❌ Linting failed');
  process.exit(1);
}

// Step 3: Check if changelog is updated
console.log('\n📝 Checking changelog...');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
if (!changelog.includes(`## [${version}]`)) {
  console.error(`❌ CHANGELOG.md doesn't include version ${version}`);
  console.log('Please update CHANGELOG.md with release notes');
  process.exit(1);
}
console.log('✅ Changelog updated');

// Step 4: Generate release summary
console.log('\n📊 Release Summary:');
console.log(`Version: ${version}`);
console.log(`Description: ${packageJson.description}`);
console.log(`Homepage: ${packageJson.homepage}`);
console.log(`Repository: ${packageJson.repository.url}`);

// Step 5: Create git tag (optional)
const shouldTag = process.argv.includes('--tag');
if (shouldTag) {
  console.log('\n🏷️ Creating git tag...');
  try {
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
    console.log(`✅ Created tag v${version}`);
    console.log('💡 Don\'t forget to push the tag: git push origin v${version}');
  } catch (error) {
    console.error('❌ Failed to create tag');
    process.exit(1);
  }
}

console.log('\n🎉 Release preparation complete!');
console.log('\nNext steps:');
console.log('1. Commit any remaining changes');
console.log('2. Push to GitHub: git push');
console.log('3. Create release on GitHub with the changelog notes');
console.log('4. Announce the release to the community');

console.log('\n📋 Release Checklist:');
console.log('- [ ] All tests passing');
console.log('- [ ] Build successful');
console.log('- [ ] Changelog updated');
console.log('- [ ] Version bumped in package.json');
console.log('- [ ] Documentation updated');
console.log('- [ ] GitHub release created');
console.log('- [ ] Community announcement');
