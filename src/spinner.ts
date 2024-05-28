import ora from "ora";
import chalk from "chalk";

export class Spinner {
  private static spinner = ora("Processing: ");

  public static handleError(error: any) {
    this.spinner.color = "red";
    this.spinner.text = "Failed ";
    this.spinner.fail("");
    console.log(chalk.red(`Error: ${error}`));
  }

  public static handleSuccess(message: string) {
    this.spinner.color = "green";
    this.spinner.text = "Completed ";
    this.spinner.succeed(chalk.green(message));
    this.spinner.stop();
  }

  public static startProcess(message: string) {
    this.spinner.start();
    this.spinner.color = "magenta";
    this.spinner.text = `${message} `;
  }

  public static infoLog(message: string) {
    console.log(chalk.gray(message));
  }
}
