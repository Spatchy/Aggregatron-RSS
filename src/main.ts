import { Repos } from "./modules/github/github.ts";
import { YoutubeFeed } from "./modules/youtube/youtube.ts";


if (import.meta.main) {
  const repos = new Repos();
  const youtubeFeed = new YoutubeFeed();
  const rss = await youtubeFeed.RSS();
  console.log(rss);
}
