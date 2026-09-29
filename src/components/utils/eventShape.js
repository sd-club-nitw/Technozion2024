export function legacyToFlat(item) {
    if (!item) return item;
    const overview = item.overview && typeof item.overview === "object" ? item.overview : {};
    return {
        name: item.title || overview.main_title || "",
        club: item.name || "",
        description: typeof item.overview === "string" ? item.overview : overview.description,
        teamSize: overview.team_size,
        contact: overview.contact || [],
        rules: item.rules,
        judgingCriteria: item.judging_criteria,
        imgsrc: item.imgsrc,
        glink: item.glink,
        totalCost: item.total_cost,
    }
}