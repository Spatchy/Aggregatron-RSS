const youtube = {
    "CHANNEL_ID": Deno.env.get("YOUTUBE_CHANNEL_PERM_ID")!,
    "CHANNEL_NAME": Deno.env.get("YOUTUBE_CHANNEL_NAME")!
}

export { youtube };