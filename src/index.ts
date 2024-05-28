import shell from "shelljs";
import fs from "fs";
import path from "path";
import { Spinner } from "./spinner";

type CopyOption = "MoveContentToRoot" | "defaultMove";
export class ProjectForge {
  private beforeBuildFuncs: Function[] = [];
  private afterBuildFuncs: Function[] = [];

  constructor(private buildCommand: string, private buildDirectory: string) {
    this.buildDirectory = path.resolve(buildDirectory);
  }

  public beforeBuild(fnc: Function) {
    this.beforeBuildFuncs.push(fnc);
  }

  public afterBuild(fnc: Function) {
    this.afterBuildFuncs.push(fnc);
  }

  public copy(record: string, option: CopyOption = "defaultMove") {
    return new CopyHelper(this.buildDirectory, record, option);
  }

  public exec(command: string) {
    return new ExecHelper(this.buildDirectory, command);
  }

  public async build() {
    try {
      // first check if buildDirectory exist. if not create it
      // Check if buildDirectory exists, if not, create it
      Spinner.startProcess("Checking if build directory exist ...");
      if (!fs.existsSync(this.buildDirectory)) {
        fs.mkdirSync(this.buildDirectory, { recursive: true });
        Spinner.handleSuccess(`Couldn't find build directory, so a build directory was created `);
      } else {
        Spinner.handleSuccess(`Build directory, exist `);
      }

      // Execute beforeBuild functions
      if (this.beforeBuildFuncs.length) {
        Spinner.startProcess("Executing beforeBuild actions.");
        for (const fnc of this.beforeBuildFuncs) {
          await fnc();
        }
        Spinner.handleSuccess(`BeforeBuild actions successfully executed.`);
      }

      // Execute build command
      Spinner.startProcess("Executing build command.");
      shell.exec(this.buildCommand);
      Spinner.handleSuccess(`Build command successfully executed. `);

      // Execute afterBuild functions
      if (this.afterBuildFuncs.length) {
        Spinner.startProcess("Executing afterBuild actions.");
        for (const fnc of this.afterBuildFuncs) {
          await fnc();
        }
        Spinner.handleSuccess(`AfterBuild actions successfully executed.`);
      }
    } catch (error: any) {
      Spinner.handleError(error);
      throw new error();
    }
  }
}

class CopyHelper {
  constructor(private buildDirectory: string, private recordToCopy: string, private option: CopyOption) {}

  private async doesPathExist(location: string) {
    try {
      const stats = await fs.promises.stat(location);
      return stats;
    } catch {
      return null;
    }
  }

  private async processCopy(recordToCopy: string, buildDirectory: string, option: CopyOption) {
    try {
      const destStats = await this.doesPathExist(buildDirectory);
      if (!destStats || !destStats.isDirectory()) {
        console.log(`Destination path "${buildDirectory}" does not exist or is not a directory. Skipping copy operation.`);
        return;
      }

      const sourceStats = await this.doesPathExist(recordToCopy);
      if (!sourceStats) {
        console.log(`Source path "${recordToCopy}" does not exist. Skipping copy operation.`);
        return;
      }

      if (sourceStats.isFile()) {
        shell.cp(recordToCopy, buildDirectory);
      } else if (sourceStats.isDirectory()) {
        if (option == "MoveContentToRoot") {
          // If it's a directory, recursively copy its contents to the build directory
          shell.cp("-r", `${recordToCopy}/*`, buildDirectory);
        } else {
          const folderName = path.basename(recordToCopy);
          const destination = path.join(buildDirectory, folderName);
          shell.cp("-r", recordToCopy, destination);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public async toBuildDirectory() {
    return await this.processCopy(this.recordToCopy, this.buildDirectory, this.option);
  }
  public async to(location: string) {
    return await this.processCopy(this.recordToCopy, location, this.option);
  }
}

class ExecHelper {
  constructor(private buildDirectory: string, private command: string) {}
  public async inBuildDirectory() {
    try {
      await shell.exec(this.command, { cwd: this.buildDirectory });
    } catch (error) {
      throw error;
    }
  }
}
