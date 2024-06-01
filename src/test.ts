import { ProjectForge } from "./index";

const builder = new ProjectForge("npm --v", "./test-build");

builder.beforeBuild(async () => {
  //console.log("Copying package.json ...");
  await builder.copy("./package.json").toBuildDirectory();
  //console.log("executing  npm install --omit=dev ...");
  //await builder.exec("npm install --omit=dev").inBuildDirectory();
});

builder.afterBuild(async () => {
  //console.log("Copying build folder to build directory ...");
  await builder.copy("./lib", "defaultMove").toBuildDirectory();
  //await builder.copy("./.env").toBuildDirectory();
});

builder.build();
