interface MediaContent {
  $url: string;
  $type: string;
  $width: number;
  $height: number;
}

interface MediaThumbnail {
  $url: string;
  $width: number;
  $height: number;
}

interface MediaStarRating {
  $count: number;
  $average: number;
  $min: number;
  $max: number;
}

interface MediaCommunity {
  "media:starRating": MediaStarRating;
  "media:statistics": { $views: number };
}

interface MediaGroup {
  "media:title": string;
  "media:content": MediaContent;
  "media:thumbnail": MediaThumbnail;
  "media:description": string;
  "media:community": MediaCommunity;
}

interface Author {
  name: string;
  uri: string;
}

interface FeedEntry {
  id: string;               // "yt:video:{videoId}"
  "yt:videoId": string;
  "yt:channelId": string;
  title: string;
  link: { $rel: string; $href: string };
  author: Author;
  published: string;       // ISO 8601 date string
  updated: string;         // ISO 8601 date string
  "media:group": MediaGroup;
}

interface FeedLink {
  $rel: "self" | "alternate";
  $href: string;
}

interface Feed {
  link: FeedLink[];
  id: string;               // "yt:channel:{channelId}"
  "yt:channelId": string;
  title: string;
  author: Author;
  published: string;       // ISO 8601 date string
  entry: FeedEntry | FeedEntry[];
  $xmlns: string;
  "$xmlns:yt": string;
  "$xmlns:media": string;
}

interface YouTubeFeed {
  "?xml": { $version: string; $encoding: string };
  feed: Feed;
}

export type { YouTubeFeed, FeedEntry }
