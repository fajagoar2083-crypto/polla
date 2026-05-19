const SUPABASE_REST_URL = "https://kenkufeidbmhclrawpnk.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_kJlCK89w0XRmBfz6gVt7iQ_vCH_Czpp";

module.exports = async function handler(req, res) {
  try {
    const path = req.query.path;

    if (!path) {
      return res.status(400).json({
        error: "Missing path",
        example: "/api/supabase?path=%2Fpartidos%3Fselect%3Did"
      });
    }

    const targetUrl = `${SUPABASE_REST_URL}${path}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer:
          req.method === "GET" || req.method === "DELETE"
            ? ""
            : "return=representation"
      },
      body:
        req.method === "GET" || req.method === "DELETE"
          ? undefined
          : JSON.stringify(req.body || {})
    });

    const text = await response.text();

    res.status(response.status);
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );

    return res.send(text);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy error",
      message: error.message,
      cause: error.cause ? String(error.cause) : null,
      supabaseUrl: SUPABASE_REST_URL
    });
  }
};
