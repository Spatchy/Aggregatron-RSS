import { GithubRepos } from "../modules/github/github.ts";
import { Module } from "../modules/Module.ts";
import { YoutubeRSS } from "../modules/youtubeRSS/youtubeRSS.ts";
import { Printables } from "../modules/printables/printables.ts";

interface TModule {
  new (): Module;
}

class NoModulesEnabledError extends Error {
  constructor() {
    super(
      "No modules were enabled! Enable at least one module via environment variables for this program to work",
    );
    this.name = "NoModulesEnabledError";
    Object.setPrototypeOf(this, NoModulesEnabledError.prototype);
  }
}

// TODO: Figure out how to make this error if we forgot to include a new module in the array
class ModuleBootstrapper {
  moduleClasses: TModule[] = [
    YoutubeRSS,
    GithubRepos,
    Printables,
  ];

  enabledModules: Module[] = [];

  constructor(enabledModuleNames: string[]) {
    console.log("Enabling the following modules:");
    this.moduleClasses.forEach((moduleClass) => {
      if (enabledModuleNames.includes(moduleClass.name)) {
        console.log(` - ${moduleClass.name}`);
        this.enabledModules.push(new moduleClass());
      }
    });

    if (this.enabledModules.length === 0) {
      throw new NoModulesEnabledError();
    }
  }
}

export { ModuleBootstrapper };
