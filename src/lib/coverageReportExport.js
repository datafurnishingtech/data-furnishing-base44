import { jsPDF } from "jspdf";

const addSectionTitle = (doc, title, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(24, 24, 27);
  doc.text(title, 18, y);
  doc.setDrawColor(229, 231, 235);
  doc.line(18, y + 3, 192, y + 3);
  return y + 10;
};

const addRows = (doc, headers, rows, y) => {
  const columnWidth = 174 / headers.length;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(245, 245, 246);
  doc.rect(18, y - 5, 174, 8, "F");
  headers.forEach((header, index) => doc.text(header, 20 + columnWidth * index, y));

  y += 8;
  doc.setFont("helvetica", "normal");
  rows.forEach((row) => {
    if (y > 276) {
      doc.addPage();
      y = 20;
    }
    row.forEach((cell, index) => {
      doc.text(String(cell || "—").slice(0, 34), 20 + columnWidth * index, y);
    });
    y += 7;
  });

  return y + 8;
};

export const downloadCoverageReport = ({
  typeFilter,
  selectedState,
  topFurnishers,
  productMix,
  watchlistData,
  tradeActivity,
  recentActivity,
}) => {
  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleString();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text("Coverage Summary Report", 18, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91);
  doc.text(`Generated: ${generatedAt}`, 18, 28);
  doc.text(`View: ${typeFilter === "all" ? "All furnisher types" : typeFilter}`, 18, 34);
  doc.text(`State: ${selectedState || "All states"}`, 18, 40);

  let y = 52;
  y = addSectionTitle(doc, "Coverage Snapshot", y);
  y = addRows(doc, ["Metric", "Value", "Change"], [
    ["Furnishers", "2,847", "+12.5%"],
    ["Tradelines", "24.6M", "+11.8%"],
    ["Bureau Coverage", "98.1%", "+2.4%"],
    ["Products", "7,312", "+15.1%"],
    ["Verified Sources", "1,842", "+10.3%"],
  ], y);

  y = addSectionTitle(doc, "Top Furnishers by Volume", y);
  y = addRows(doc, ["Rank", "Furnisher", "Tradelines"], topFurnishers.map((item) => [item.rank, item.name, item.tradelines]), y);

  y = addSectionTitle(doc, "Product Mix", y);
  y = addRows(doc, ["Category", "Share"], productMix.map((item) => [item.name, `${item.value}%`]), y);

  y = addSectionTitle(doc, "Watchlist Snapshot", y);
  y = addRows(doc, ["Watchlist", "Items"], watchlistData.map((item) => [item.name, item.items]), y);

  y = addSectionTitle(doc, "Recent Trade Activity", y);
  y = addRows(doc, ["Trade ID", "Furnisher", "Product", "Bureau", "Status"], tradeActivity.map((item) => [
    item.id,
    item.furnisher,
    item.product,
    item.bureau,
    item.status,
  ]), y);

  if (y > 238) {
    doc.addPage();
    y = 20;
  }
  y = addSectionTitle(doc, "Recent Activity", y);
  addRows(doc, ["Activity", "Details", "Time"], recentActivity.map((item) => [item.title, item.desc, item.time]), y);

  doc.save(`coverage-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
};