# ESS-SPT Test Automation ♻️

## Project Scripts Guide 🌐✨

Welcome to the project! This guide explains the structure and purpose of the scripts defined in `package.json`. These scripts streamline common tasks and allow you to quickly set up, test, and debug the project. Here's how they work:

### important Note For Branching Project Convention:

When checking out a new branch, we follow this naming convention:

- **SPT-story#-title-of-story**
- **Example: SPT-89-admin-delete-survey**

This convention automatically links our branches to the corresponding Jira story, making it easier to track and reference the code in the future if needed.Once the branch is pushed to the remote repo, it’ll be linked directly to the Jira story.

---

1. install yarn (if not already installed) 🧶

```
  npm install --global yarn
```

2. ### Install Test Automation Dependencies (Installation Scripts)🧩

3. ### create a .env file in ./testing/UI(if not done already) & update env variables that may have been added 📧 (see Utility Scripts below)

4. ### make sure to enter all necessary env values in the .env file (env values must be obtained by an active contributor.alues must be obtained by an active contributor.) 📝

---

### Installation Scripts 📦

- **`install:deps`**:
  Installs all required dependencies and ensures Playwright browsers are correctly set up. This script is your starting point when you first clone the repository:

  ```bash
  yarn install:deps
  ```

  This ensures a smooth environment for running Playwright tests.

---

### Testing Scripts 🎯

These scripts run Playwright tests for different environments and configurations:

    "test:admin": "yarn test:ess:spt --project=lime-survey-admin",

1. **`test:ess:spt`**:
   Runs Playwright tests headless for admin and user tests:

   ```bash
   yarn test:ess:spt
   ```

2. **`test:admin`**:
   Extends `test:ess:spt` and adds project flag for admin only run (--project=lime-survey-admin) :

   ```bash
   yarn test:admin
   ```

---

### Playwright Codegen Scripts 🔬

Generate Playwright scripts:

1. **`playwright:codegen:admin`**:
   The base script for generating Playwright code snippets:

   ```bash
   yarn playwright:codegen:admin
   ```

2. **`playwright:codegen:user`**:
   Adds REG_USER=true for UI mode testing user facing tests

   ```bash
   yarn playwright:codegen:user
   ```

---

### Playwright UI Mode 🎨

Run Playwright tests in interactive UI mode:

1. **`playwright:ui:mode`**:
   Launches the Playwright UI test runner:

   ```bash
   yarn playwright:ui:mode
   ```

2. **`playwright:codegen:admin`**:
   UI mode for testing admin tests

   ```bash
   yarn playwright:codegen:admin
   ```

---

### Utility Scripts 🔧

- **`update:env:file`**:
  Updates environment variables using a bash script.:

  ```bash
  yarn update:env:file
  ```

---

# Documentation for Automated Test Framework 🌟

## Overview

## This documentation outlines the core components and utilities of the automated test framework, designed for use with this frameowrk. It includes descriptions of key classes, methods, and fixtures to assist developers and test engineers in leveraging the framework efficiently.

## Fixture: `PomFixture` 🏗️

### Overview

Defines a type for the shared `Pom` fixture, containing all Page Object Models (POMs) and utility classes.

### Extended Test

The base Playwright `test` is extended to include the `Pom` fixture.

---

## Decorator: `@step` 📝

### Overview

A decorator function for wrapping POM methods in `test.step` for step-level reporting.

### Usage

- Without a step name: `@step()`
- With a step name: `@step("Step Name")`

---

## Script: Playwright Codegen Execution 🖥️

### Overview

This script leverages Playwright's code generation utility to interactively generate scripts by launching a browser and navigating to the specified base URL.

### Description

- **Purpose**: To simplify script creation by utilizing Playwright's codegen tool.
- **Details**: The script runs `npx playwright codegen` with a viewport size of `1600x900` and navigates to the base URL retrieved from the `getBaseUrl` helper.
- **Error Handling**:
  - Logs errors if the command fails.
  - Outputs standard error and standard output for debugging.

### Usage Example

```bash
node runPlaywrightCodeGen.ts
```

---

## Utility Exports 🛠️

### Overview

Exports various utility classes and functions for use in the automated testing framework. These include POMs, helper classes, and API service utilities.

### Exports

```javascript
require("dotenv").config();
// Load Chance
import Chance from "chance";
export const chance =
  new Chance();

export { Auth } from "./page-object-models/command-classes/auth-commands";
export { UserDashboard } from "./page-object-models/user-dashboard";
```

### Description

- **Purpose**: Centralizes imports and configurations to simplify the setup and usage of POMs, utilities, and helpers.
- **Details**:
  - Loads environment variables using `dotenv`.
  - Instantiates and exports a `Chance` object for generating random data.
  - Exports POM classes and utility services for broader use in the testing framework.

### Notes

- Ensure all referenced files and directories are correctly structured and accessible in the project.

---

## Script: Environment File Synchronization 🔄

### Overview

This Bash script ensures synchronization between `.env` and `.env.example` files. It creates a `.env` file if it doesn’t exist and updates it with any new variables found in `.env.example`.

### Description

- **Purpose**: Ensures `.env` contains all necessary variables by checking against `.env.example`.
- **Details**:
  - Creates `.env` from `.env.example` if it doesn’t exist.
  - Adds missing variables to `.env` while avoiding duplicates.
  - Uses color-coded output for better visibility.

### Usage

1. Place the script in the project root.
2. Run the script with:
   ```bash
   ./sync-env.sh
   ```
3. Ensure `.env.example` is up to date with all required variables.

### Happy coding! 🚀
