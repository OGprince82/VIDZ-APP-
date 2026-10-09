module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Use GET to check status." });
  }

  const key = process.env.RUNWAYML_API_SECRET;
  const id = req.query.id;

  if (!key) {
    return res.status(500).json({ error: "Runway API key is missing." });
  }

  if (!id) {
    return res.status(400).json({ error: "Video task ID is missing." });
  }

  try {
    const response = await fetch(
      `https://api.dev.runwayml.com/v1/tasks/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "X-Runway-Version": "2024-11-06"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || data.message || "Could not check video status."
      });
    }

    return res.status(200).json({
      status: data.status,
      url: data.output?.[0] || null
    });
  } catch {
    return res.status(500).json({
      error: "Could not connect to Runway."
    });
  }
};
