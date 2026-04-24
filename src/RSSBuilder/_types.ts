interface itemObject {
  title: string,
  description: string,
  link: string,
  pubDate: Date,
  enclosure?: {
    $url: string,
    $length: number,
    $type: string
  }
}

interface feedObject {
  rss: {
    $version: "0.91" | "1.0" | "2.0"
    title: string,
    description: string,
    link: string
    item: itemObject[]
  }
}

export type { itemObject, feedObject }