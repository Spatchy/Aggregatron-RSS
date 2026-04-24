const github = {
    "USER": Deno.env.get("GITHUB_USER")!,
    "AUTH_KEY": Deno.env.get("GITHUB_AUTH_KEY")!
}

export { github };