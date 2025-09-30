#!/usr/bin/env node

/**
 * CI/CD Pipeline Drift Prevention Tool
 * 
 * Validates that GitHub Actions workflows reference only existing npm scripts.
 * Prevents pipeline drift caused by incomplete refactoring.
 * 
 * Usage:
 *   node tests/ci-validation/validate-workflow-scripts.js
 * 
 * Exit codes:
 *   0 - All workflows reference valid scripts
 *   1 - One or more workflows reference invalid scripts
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class WorkflowScriptValidator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.workflowsDir = path.join(this.projectRoot, '.github', 'workflows');
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Load and parse package.json to get available scripts
   */
  loadPackageScripts() {
    try {
      const packageContent = fs.readFileSync(this.packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      return packageJson.scripts || {};
    } catch (error) {
      this.errors.push(`Failed to load package.json: ${error.message}`);
      return {};
    }
  }

  /**
   * Find all GitHub Actions workflow files
   */
  findWorkflowFiles() {
    try {
      if (!fs.existsSync(this.workflowsDir)) {
        this.warnings.push('No .github/workflows directory found');
        return [];
      }

      return fs.readdirSync(this.workflowsDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map(file => path.join(this.workflowsDir, file));
    } catch (error) {
      this.errors.push(`Failed to read workflows directory: ${error.message}`);
      return [];
    }
  }

  /**
   * Parse YAML workflow file and extract npm run commands
   */
  extractNpmCommands(workflowPath) {
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(content);
      const commands = [];

      // Recursively search for 'run' steps that contain 'npm run'
      const findRunSteps = (obj, path = '') => {
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => findRunSteps(item, `${path}[${index}]`));
          } else {
            Object.entries(obj).forEach(([key, value]) => {
              if (key === 'run' && typeof value === 'string' && value.includes('npm run')) {
                commands.push({
                  command: value,
                  path: path,
                  file: workflowPath
                });
              } else {
                findRunSteps(value, path ? `${path}.${key}` : key);
              }
            });
          }
        }
      };

      findRunSteps(workflow);
      return commands;
    } catch (error) {
      this.errors.push(`Failed to parse ${workflowPath}: ${error.message}`);
      return [];
    }
  }

  /**
   * Extract script name from npm run command
   */
  extractScriptName(command) {
    // Match patterns like "npm run script-name" or "npm run script-name --args"
    const match = command.match(/npm run\s+([^\s]+)/);
    return match ? match[1] : null;
  }

  /**
   * Validate that all referenced scripts exist
   */
  validateScripts(availableScripts, npmCommands) {
    const referencedScripts = new Set();
    
    npmCommands.forEach(({ command, path: commandPath, file }) => {
      const scriptName = this.extractScriptName(command);
      if (scriptName) {
        referencedScripts.add(scriptName);
        
        if (!availableScripts[scriptName]) {
          this.errors.push(
            `❌ Missing script: "${scriptName}" referenced in ${path.basename(file)} at ${commandPath}\n` +
            `   Command: ${command}`
          );
        }
      }
    });

    // Check for unused scripts (warnings only)
    const unusedScripts = Object.keys(availableScripts).filter(
      script => !referencedScripts.has(script) && !script.startsWith('_')
    );
    
    if (unusedScripts.length > 0) {
      this.warnings.push(
        `⚠️  Unused scripts found: ${unusedScripts.join(', ')}\n` +
        `   These scripts are defined but not referenced in any workflow`
      );
    }
  }

  /**
   * Generate validation report
   */
  generateReport(availableScripts, npmCommands) {
    console.log('🔍 CI/CD Pipeline Script Validation\n');
    console.log(`📦 Available scripts: ${Object.keys(availableScripts).length}`);
    console.log(`🔧 Workflow commands: ${npmCommands.length}`);
    console.log('');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All workflows reference valid scripts!');
      return true;
    }

    if (this.errors.length > 0) {
      console.log('❌ Validation Errors:');
      this.errors.forEach(error => console.log(error));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(warning));
      console.log('');
    }

    // Show available scripts for reference
    console.log('📋 Available scripts:');
    Object.entries(availableScripts).forEach(([name, command]) => {
      console.log(`   ${name}: ${command}`);
    });

    return this.errors.length === 0;
  }

  /**
   * Main validation method
   */
  validate() {
    console.log('🚀 Starting CI/CD Pipeline Script Validation...\n');

    const availableScripts = this.loadPackageScripts();
    const workflowFiles = this.findWorkflowFiles();
    
    if (workflowFiles.length === 0) {
      console.log('⚠️  No workflow files found');
      return true;
    }

    let allNpmCommands = [];
    workflowFiles.forEach(file => {
      const commands = this.extractNpmCommands(file);
      allNpmCommands = allNpmCommands.concat(commands);
    });

    this.validateScripts(availableScripts, allNpmCommands);
    return this.generateReport(availableScripts, allNpmCommands);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new WorkflowScriptValidator();
  const isValid = validator.validate();
  process.exit(isValid ? 0 : 1);
}

module.exports = WorkflowScriptValidator;
