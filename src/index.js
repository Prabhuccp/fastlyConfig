//<reference types="@fastly/js-compute" />

addEventListener("fetch", event => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  const req = event.request;
  const url = new URL(req.url);
  const path = url.pathname;

  // Replace with your GitHub repo details
  const owner = "Prabhuccp";
  const repo = "fastlyConfig";
  const branch = "main";

  // Construct the raw GitHub URL for the file
  const githubPath = `/` + [owner, repo, branch, path.slice(1)].join(`/`);

  const originReq = new Request(`https://raw.githubusercontent.com${githubPath}`, {
    method: "GET",
    headers: {
      "User-Agent": "Fastly-Edge-Compute", // GitHub requires a UA
      "Accept": "*/*"
    }
  });

  const originResp = await fetch(originReq);

  // Handle not found
  if (originResp.status === 404) {
    return new Response("Asset not found", { status: 404 });
  }

  return originResp;
}
