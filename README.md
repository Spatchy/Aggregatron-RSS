# Aggregatron RSS
![Aggregatron logo banner](/branding/github-banner.svg "Aggregatron logo banner")
Aggregatron RSS polls the APIs from multiple services to get a list of all your projects and combines the results into a single RSS feed.

Allow your followers to discover everything you do, as you do it, without having to subscribe on multiple different platforms.

Showcase your projects in a single portfolio that updates automatically, no matter what you make or where it's hosted!

## Supported Platforms
Aggregatron RSS currently supports the following platforms:

<span>
<img height="16" width="16" src="https://cdn.simpleicons.org/youtube" /> YouTube (Your published videos) <br />
<img height="16" width="16" src="https://cdn.simpleicons.org/github/white" /> GitHub (Repos owned by you) <br />
<img height="16" width="16" src="https://cdn.simpleicons.org/printables" /> Printables (Your public 3D models) <br />
</span><br />

More platforms will be added soon!
## Demo
See [spatchy.net](https://spatchy.net) as an example of how Aggregatron RSS is powering my own portfolio site!

## Configuration
Aggregatron RSS is configured using environment variables. Create a `.env` file or use the `environment` block in your compose file or container manager to set these options.

The following tables describe each option

### General

| Variable | Type | Optional | Default | Description |
|---|---|---|---|---|
| `REFRESH_INTERVAL_MINUTES` | number | ❌ | — | How often the feed refreshes, in minutes |
| `FEED_URL` | text | ❌ | — | The URL at which the RSS feed will be served |
| `FEED_TITLE` | text | ✅ | `Aggregatron meta RSS feed` | The title of the generated RSS feed |
| `FEED_DESCRIPTION` | text | ✅ | `Aggregatron meta RSS feed` | The description of the generated RSS feed |

---

### Modules

#### GitHub Repos

| Variable | Type | Optional | Default | Description |
|---|---|---|---|---|
| `GITHUB_REPOS_ENABLE` | boolean | ✅ | `false` | Enables the GitHub Repos module |
| `GITHUB_REPOS_USER` | text | ❌ | — | The GitHub username whose repositories will be fetched |
| `GITHUB_REPOS_AUTH_KEY` | text | ❌ | — | A GitHub personal access token used to authenticate API requests |
| `GITHUB_REPOS_FILTER_OUT_FORKS` | boolean | ✅ | `false` | When enabled, forked repositories are excluded from the feed |
| `GITHUB_REPOS_FILTER_OUT_PRIVATE` | boolean | ✅ | `true` | When enabled, private repositories are excluded from the feed |
| `GITHUB_REPOS_FILTER_OUT_ARCHIVED` | boolean | ✅ | `false` | When enabled, archived repositories are excluded from the feed |
| `GITHUB_REPOS_FILTER_BY_NAME` | comma-separated text | ✅ | — | A list of repository names to always exclude |

#### YouTube RSS

| Variable | Type | Optional | Default | Description |
|---|---|---|---|---|
| `YOUTUBE_RSS_ENABLE` | boolean | ✅ | `false` | Enables the YouTube RSS module |
| `YOUTUBE_RSS_PERMANENT_CHANNEL_ID` | text | ❌ | — | The permanent channel ID of the YouTube channel to follow (starts with `UC...`) |

#### Printables

| Variable | Type | Optional | Default | Description |
|---|---|---|---|---|
| `PRINTABLES_ENABLE` | boolean | ✅ | `false` | Enables the Printables module |
| `PRINTABLES_USER_HANDLE` | text | ❌ | — | The Printables username whose models will be fetched (starts with `@...`) |
| `PRINTABLES_SKIP_REUPLOADS` | boolean | ✅ | `false` | When enabled, models identified as reuploads are excluded from the feed |
| `PRINTABLES_SKIP_NSFW` | boolean | ✅ | `false` | When enabled, models marked as NSFW are excluded from the feed |
| `PRINTABLES_USE_SITE_LISTING_THUMBNAIL` | boolean | ✅ | `false` | When enabled, uses the Printables thumbnail image of the model listing instead of the 3D preview image |
| `PRINTABLES_MINIMUM_RATING` | number | ✅ | `0` | Minimum rating a model must have to be included in the feed |

## Building and Development
### <img height="20" width="20" src="https://cdn.simpleicons.org/nixos" /> Using Nix (recommended)
- [Install the Nix package manager](https://nixos.org/download/) if you haven't already
- `cd` into the project directory and run `nix develop` (or use [direnv](https://direnv.net/))
- run `deno run --env-file --allow-env --allow-net --allow-read --allow-write src/main.ts` to start the program and generate the first feed
### <img height="20" width="20" src="https://cdn.simpleicons.org/deno/white" /> Manually with Deno
- You can also [install Deno](https://docs.deno.com/runtime/getting_started/installation/) manaully
- run `deno run --env-file --allow-env --allow-net --allow-read --allow-write src/main.ts` to start the program and generate the first feed
## Building the Docker Image
- run `docker build -t "aggregatron-rss" .` to build the Docker image
- run `docker compose up` to start the container with the current compose file configuration
