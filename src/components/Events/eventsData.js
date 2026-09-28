import rawEvents from "../../data/new_events.json";

function parsePOC(pocRaw, email) {
  if (!pocRaw) return [];
  const rawEntries = pocRaw
    .split(/[\n|]+|,\s*(?=[A-Za-z])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const contacts = [];
  let i = 0;
  while (i < rawEntries.length) {
    const entry = rawEntries[i];
    const phoneMatch = entry.match(/(?:\+?91[\s-]*)?([6-9](?:[\s-]*\d){9})/);
    if (phoneMatch) {
      const rawDigits = phoneMatch[1].replace(/\D/g, "");
      let name = entry
        .replace(phoneMatch[0], "")
        .replace(/^\s*\d+[.)]\s*/, "")
        .replace(/[()[\]\-:,]/g, " ")
        .trim()
        .replace(/\s+/g, " ");
      contacts.push({
        name: name || "Coordinator",
        phone: rawDigits,
        email: contacts.length === 0 ? email : "",
      });
      i++;
    } else if (i + 1 < rawEntries.length) {
      const nextEntry = rawEntries[i + 1];
      const nextPhone = nextEntry.match(/(?:\+?91[\s-]*)?([6-9](?:[\s-]*\d){9})/);
      if (nextPhone) {
        const rawDigits = nextPhone[1].replace(/\D/g, "");
        let name = entry
          .replace(/^\s*\d+[.)]\s*/, "")
          .replace(/[()[\]\-:,]/g, " ")
          .trim()
          .replace(/\s+/g, " ");
        contacts.push({
          name: name || "Coordinator",
          phone: rawDigits,
          email: contacts.length === 0 ? email : "",
        });
        i += 2;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  if (email && contacts.length > 0 && !contacts[0].email) {
    contacts[0].email = email;
  }
  return contacts;
}

function parsePrizeInfo(description, rules) {
  const text = `${description}\n${rules}`;
  let totalCost = null;
  let cashPrize = null;

  const poolMatch = text.match(/(\d+(?:,\d+)?\s*[kK]?)\s*prize\s*pool/i);
  if (poolMatch) {
    let val = poolMatch[1].trim();
    if (val.toLowerCase().endsWith("k")) {
      val = val.slice(0, -1) + ",000";
    }
    totalCost = val;
    cashPrize = `${val} (Prize Pool)`;
  }

  if (/competing for cash prizes|cash prizes/i.test(text)) {
    if (!cashPrize) cashPrize = "Cash prizes for top 3 finishers";
  } else if (/compete for the prize pool/i.test(text)) {
    if (!cashPrize) cashPrize = "Prize pool for qualifying participants";
  } else if (/prizes in form of goodies/i.test(text)) {
    if (!cashPrize) cashPrize = "Prizes & goodies for model winners & top scorers";
  } else if (
    /top 3 finishers win prizes|top three scorers walk away with prizes/i.test(
      text
    )
  ) {
    if (!cashPrize) cashPrize = "Prizes awarded to top 3 finishers";
  }

  return { totalCost, cashPrize };
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
  const { totalCost, cashPrize } = parsePrizeInfo(description, rulesRaw);
  const urlMatch = `${rulesRaw} ${description}`.match(/https?:\/\/[^\s"'<>]+/);
  const glink = urlMatch ? urlMatch[0] : "";

  return {
    index: index + 1,
    title: title,
    name: clubName,
    event_type: eventType,
    total_cost: totalCost,
    imgsrc: "", // Posters not yet provided; will show cyber TBA placeholder
    overview: {
      main_title: title,
      description: description,
      team_size: teamSize || "Coming Soon...",
      duration: duration,
      event_type: eventType,
      cash_prize: cashPrize,
      contact: contact,
    },
    rules: rules,
    judging_criteria: "Coming Soon...",
    glink: glink,
  };
});

