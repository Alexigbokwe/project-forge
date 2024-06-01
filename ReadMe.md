## Project-Forge

Project-Forge is a Node.js build tool designed to streamline the process of building projects. It simplifies the workflow by automating tasks such as compiling TypeScript to JavaScript, copying files, and running commands before and after the build process.

### Installation

To install Project-Forge, use npm, yarn or bun:

```cli
npm install project-forge --save-dev
```

Or

```cli
yarn add project-forge
```

### Usage

In the root of your project, create a build configuration file named <code>buildConfiguration.ts</code>. This file will contain the configuration for your build process.

Here's an example of a basic <code>buildConfiguration.ts</code> file:

```ts
import { ProjectForge } from "project-forge";

const builder = new ProjectForge("npm run build", "../UserService");

builder.beforeBuild(async () => {
  await builder.copy("./package.json").toBuildDirectory();
  await builder.exec("npm install --omit=dev").inBuildDirectory();
});

builder.afterBuild(async () => {
  await builder.copy("./build", "MoveContentToRoot").toBuildDirectory();
  await builder.copy("./.env").toBuildDirectory();
});

builder.build();
```

### Run the Build Process:

Execute the build process by running the following command in your terminal:

```cli
ts-node buildConfiguration.ts
```

This will execute the tasks defined in your buildConfiguration.ts file and generate a production build for your project.

That's it! You've successfully used Project-Forge to streamline your Node.js build process. You can customize your build configuration to include additional tasks as needed for your project.

### APIs

#### Project-Forge Constructor

```ts
new ProjectForge(buildCommand: string, buildDirectory: string)
```

- buildCommand: The command to run for building the TypeScript project (e.g., npm run build).
- buildDirectory: The directory where the build artifacts will be placed.

#### Methods

```ts
 beforeBuild(fnc: Function)
```

Registers a function to be executed before the build process starts.

- fnc: An asynchronous function to be executed before the build process.

```ts
afterBuild(fnc: Function)
```

Registers a function to be executed after the build process completes.

- fnc: An asynchronous function to be executed after the build process.

```ts
toBuildDirectory();
```

Copies the specified file or directory to the build directory.

```ts
to(location: string)
```

Copies the specified file or directory to a given location.

```ts
inBuildDirectory();
```

Executes the specified command in the build directory.

```ts
build();
```

Starts the build process, executing registered beforeBuild and afterBuild functions.

### Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue on GitHub.

### License

This project is licensed under the MIT License.
