import rawEvents from "../../data/new_events.json";

function parsePOC(pocRaw, email) {
  if (!pocRaw) return [];
  const contacts = [];
  const lines = pocRaw
    .split(/[\n|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(" and ") && line.match(/\d{10}.*and.*\d{10}/)) {
      const parts = line.split(" and ");
      parts.forEach((p) => {
        const phoneMatch = p.match(/(?:\+91\s*)?([6-9]\d{9}|\d{5}\s*\d{5})/);
        if (phoneMatch) {
          const phone = phoneMatch[1].replace(/\s+/g, "");
          const name = p.replace(phoneMatch[0], "").replace(/[-:]/g, "").trim();
          contacts.push({ name, phone });
        }
      });
      continue;
    }

    const phoneMatch = line.match(/(?:\+91\s*)?([6-9]\d{9}|\d{5}\s*\d{5})/);
    if (phoneMatch) {
      const phone = phoneMatch[1].replace(/\s+/g, "");
      const name = line.replace(phoneMatch[0], "").replace(/[-:]/g, "").trim();
      contacts.push({ name, phone });
    } else if (
      i + 1 < lines.length &&
      lines[i + 1].match(/(?:\+91\s*)?([6-9]\d{9}|\d{5}\s*\d{5})/)
    ) {
      const name = line.replace(/[-:]/g, "").trim();
      const phone = lines[i + 1]
        .match(/(?:\+91\s*)?([6-9]\d{9}|\d{5}\s*\d{5})/)[1]
        .replace(/\s+/g, "");
      contacts.push({ name, phone });
      i++;
    }
  }

  if (email && contacts.length > 0) {
    contacts[0].email = email;
  }
  return contacts;
}

export const events2026 = rawEvents.map((raw, index) => {
  const title = (raw["Event Name"] || "").trim();
  const clubName = (raw["Club Name"] || "").trim();
  const description = (
    raw["Event Description mention clearly and elaborately"] || ""
  ).trim();
  const eventType = (raw["Event Type"] || "").trim();
  const teamSize = (
    raw["Team size (write 1 if individual participation)"] || ""
  ).trim();
  const duration = (
    raw["Approx time it takes for one student to complete the event"] || ""
  ).trim();
  const rulesRaw = (
    raw[
      "Rules of the Event, include how many rounds, any procedure to follow, etc."
    ] || ""
  ).trim();
  const pocRaw = (raw["POC for doubts - name and phone number"] || "").trim();
  const email = (raw["Email Address"] || "").trim();

  let rules = [];
  if (
    rulesRaw &&
    rulesRaw.toLowerCase() !== "none" &&
    rulesRaw.toLowerCase() !== "not applicable"
  ) {
    rules = rulesRaw
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  } else {
    rules = [
      "No specific rules provided for this event. Follow general fest guidelines.",
    ];
  }

  const contact = parsePOC(pocRaw, email);

  let totalCost = null;
  const prizeMatch = description.match(/(\d+k|\d+,\d+|\d+)\s*prize\s*pool/i);
  if (prizeMatch) {
    totalCost = prizeMatch[1];
  }

  return {
    index: index + 1,
    title: title,
    name: clubName,
    event_type: eventType,
    total_cost: totalCost,
    imgsrc: "", // Posters not yet provided; empty for now as requested
    overview: {
      main_title: title,
      description: description,
      team_size: teamSize || "Coming Soon...",
      duration: duration,
      event_type: eventType,
      contact: contact,
    },
    rules: rules,
    judging_criteria: "Coming Soon...",
    glink: "",
  };
});
