import { EnvVarsData } from "./EnvVarManager/_types.ts";
import { EnvVarManager } from "./EnvVarManager/envVarManager.ts";
import { ModuleBootstrapper } from "./ModuleBootstrapper/ModuleBootstrapper.ts";
import { RSSCombine } from "./RSSCombine/rssCombine.ts";

class TooManyConsecutiveErrorsError extends Error {
  constructor() {
    super("Errors occured on 3 consecutive attempts and need to be resolved before the program can continue");
    this.name = "TooManyConsecutiveErrorsError";
    Object.setPrototypeOf(this, TooManyConsecutiveErrorsError.prototype);
  }
}

class Main {
  envs: EnvVarsData;
  combiner: RSSCombine;
  runningErrors: Error[];

  constructor() {
    EnvVarManager.validate(); // this must ALWAYS be the first thing that happens!

    this.envs = EnvVarManager.vars;
    this.combiner = new RSSCombine();
    this.runningErrors = [];
  }

  async initFilesystem() {
    const dirs = [
      "data",
    ];

    for (const dir of dirs) {
      try {
        const _stats = await Deno.lstat(dir);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          console.log(`WARN: ${dir} folder does not exist, creating...`);
          await Deno.mkdir(dir);
        } else {
          throw err;
        }
      }
    }
  }

  async run(startedTime: Date) {
    const enabledModuleNames = Object.keys(this.envs.modules).map(
      (moduleName) => {
        const key = moduleName as keyof typeof this.envs.modules;
        if (this.envs.modules[key].enable) {
          return moduleName;
        }
      },
    ).filter((x) => x !== undefined);

    const bootstrapper = new ModuleBootstrapper(enabledModuleNames);

    try {
      const rssStrings = await Promise.all(
        bootstrapper.enabledModules.map(async (module) => await module.RSS()),
      );

      const rss = this.combiner.combine(rssStrings);

      await this.initFilesystem();

      await Deno.writeTextFile("data/feed.xml", rss);

      const deltaTime = Date.now() - startedTime.getTime();
      console.log(`New RSS written to disk after ${deltaTime / 1000} seconds`);

      this.runningErrors = [];
    } catch (e) {
      if (e instanceof Error) {
        this.runningErrors.push(e);

        console.error(
          `The program encountered an error in one or more modules (see below).
          Aborting this attempt and waiting ${this.envs.general.refreshInterval} minutes`,
        );

        console.error(e.name, e.message);

        if (this.runningErrors.length >= 3) {
          throw new TooManyConsecutiveErrorsError()
        }
      }
    }
  }

  runWithTimer() {
    const started = new Date(Date.now());
    console.log(`Running at ${started.toISOString()}`);
    this.run(started);

    setTimeout(() => {
      this.runWithTimer();
    }, Number(this.envs.general.refreshInterval) * 60 * 1000);
  }
}

if (import.meta.main) {
  const main = new Main();
  main.runWithTimer();
}
