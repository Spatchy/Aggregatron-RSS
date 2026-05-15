import { GithubRepos } from "../modules/github/github.ts";
import { Module } from "../modules/Module.ts";
import { YoutubeRSS } from "../modules/youtubeRSS/youtubeRSS.ts";

interface TModule {
  new (): Module;
}

class ModuleBootstrapper {
  moduleClasses: TModule[] = [
    YoutubeRSS,
    GithubRepos,
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
  }
}

export { ModuleBootstrapper };
