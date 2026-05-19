const SUPABASE_REST_URL = "https://kenkufeidbmhclrawpnk.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_kJlCK89w0XRmBfz6gVt7iQ_vCH_Czpp";

export default async function handler(req, res) {
  try {
    const path = req.query.path;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ error: "Missing path" });
    }

    const method = req.method || "GET";

    const response = await fetch(SUPABASE_REST_URL + path, {
      method,
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": method === "GET" || method === "DELETE" ? "" : "return=representation"
      },
      body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(req.body || {})
    });

    const text = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy error",
      message: error.message
    });
  }
}
