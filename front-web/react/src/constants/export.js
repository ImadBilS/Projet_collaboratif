import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1) KPI
    const kpiSheet = XLSX.utils.json_to_sheet([
        {
            "Ressources publiées": stats.totalResources,
            "Vues totales": stats.totalViews,
            "Commentaires": stats.totalComments,
            "Réactions": stats.totalReactions
        }
    ]);
    XLSX.utils.book_append_sheet(wb, kpiSheet, "KPI");

    // 2) Ressources les plus vues
    const mostViewedSheet = XLSX.utils.json_to_sheet(stats.mostViewed);
    XLSX.utils.book_append_sheet(wb, mostViewedSheet, "Ressources vues");

    // 3) Utilisateurs actifs
    const activeUsersSheet = XLSX.utils.json_to_sheet(
        stats.activeUsers.map(u => ({
            user_id: u.user_id,
            firstname: u.firstname,
            lastname: u.lastname,
            ressources: u._count.resources,
            commentaires: u._count.comments,
            reactions: u._count.reactions
        }))
    );
    XLSX.utils.book_append_sheet(wb, activeUsersSheet, "Utilisateurs actifs");

    // 4) Ressources par ville
    const citySheet = XLSX.utils.json_to_sheet(stats.resourcesByCity);
    XLSX.utils.book_append_sheet(wb, citySheet, "Ressources par ville");

    // Export
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "stats_plateforme.xlsx");
};

export default exportToExcel;