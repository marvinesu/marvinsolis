const REQUIRED_FIELDS = [
  "name",
  "phone",
  "email",
  "businessName",
  "serviceNeeded",
  "message",
];

const MAX_LENGTHS = {
  name: 120,
  phone: 40,
  email: 254,
  businessName: 160,
  serviceNeeded: 160,
  message: 4000,
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function normalizeLead(input) {
  const lead = {};
  for (const field of REQUIRED_FIELDS) {
    const value = typeof input[field] === "string" ? input[field].trim() : "";
    if (value.length < 2 || value.length > MAX_LENGTHS[field]) return null;
    lead[field] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  return lead;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      let input;
      try {
        input = await request.json();
      } catch {
        return json({ error: "Invalid request" }, 400);
      }

      const lead = normalizeLead(input);
      if (!lead) return json({ error: "Missing or invalid fields" }, 400);

      await env.LEADS.prepare(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          business_name TEXT NOT NULL,
          service_needed TEXT NOT NULL,
          message TEXT NOT NULL,
          source TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `).run();

      await env.LEADS.prepare(`
        INSERT INTO leads (
          name, phone, email, business_name, service_needed, message, source, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(
          lead.name,
          lead.phone,
          lead.email,
          lead.businessName,
          lead.serviceNeeded,
          lead.message,
          "marvinsolis.com",
          new Date().toISOString(),
        )
        .run();

      return json({ ok: true });
    }

    return env.ASSETS.fetch(request);
  },
};
