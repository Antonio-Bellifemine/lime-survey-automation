import {getBaseUrl} from "./utils/helpers";
import { exec } from 'child_process';

// Run the npx playwright codegen command with the selected project URL
exec(`npx playwright codegen --viewport-size=1600,900 ${getBaseUrl()}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});