import { Octokit } from "octokit";
import { github as envs } from "./.envs.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";

const octokit = new Octokit({ auth: envs.AUTH_KEY });

class Repos {
  rssBuilder = new RSSBuilder(
    "Github Repos",
    `A list of ${envs.USER}'s github repos`,
    `https://github.com/${envs.USER}?tab=repositories`,
  );

  async fetchRepos() {
    return await octokit.request("GET /users/{username}/repos", {
      username: envs.USER,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
  }

  async RSS() {
    const reposData = await this.fetchRepos();

    // TODO: probably should make this async
    reposData.data.forEach((repo) => {
      this.rssBuilder.addItem({
        title: repo.name,
        pubDate: new Date(repo.created_at ?? ""),
        description: repo.description ?? "",
        link: repo.html_url,
        // TODO: Add enclosure with image
      })
    });

    return this.rssBuilder.build()
  }
}

export { Repos };
