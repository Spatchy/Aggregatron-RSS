import { Repos } from "./modules/github/github.ts";


if (import.meta.main) {
  const repos = new Repos();
  const rss = await repos.RSS();
  console.log(rss);
}
