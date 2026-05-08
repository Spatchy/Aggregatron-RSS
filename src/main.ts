import { GeneralEnvsData } from "./_types.ts";
import { EnvVarManager } from "./EnvVarManager/envVarManager.ts";
import { Repos } from "./modules/github/github.ts";
import { YoutubeFeed } from "./modules/youtube/youtube.ts";
import { RSSCombine } from "./RSSCombine/rssCombine.ts";

class Main {
  envs: GeneralEnvsData;
  repos = new Repos();
  youtubeFeed = new YoutubeFeed();
  combiner = new RSSCombine();

  constructor() {
    const [refreshInterval] = EnvVarManager.validate([
      "REFRESH_INTERVAL_MINS",
    ]);

    this.envs = {
      refreshInterval,
    };
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
    const rssGithub = await this.repos.RSS();
    const rssYoutube = await this.youtubeFeed.RSS();

    const rss = this.combiner.combine([rssGithub, rssYoutube]);

    await this.initFilesystem();

    
    await Deno.writeTextFile("data/feed.xml", rss);

    const deltaTime = Date.now() - startedTime.getTime();
    console.log(`New RSS written to disk after ${deltaTime / 1000} seconds`);
  }

  runWithTimer() {
    const started = new Date(Date.now());
    console.log(`Running at ${started.toISOString()}`)
    this.run(started);

    setTimeout(() => {
      this.runWithTimer();
    }, Number(this.envs.refreshInterval)*60*1000);
  }
}

if (import.meta.main) {
  const main = new Main();
  main.runWithTimer();
}
