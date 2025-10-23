// services/logger.js
import fs from "fs";
import path from "path";

export function logFailedDeal(deal, error) {
  const logPath = path.join(process.cwd(), "failedDeals.log");
  const logEntry = `${new Date().toISOString()} - Deal ${deal.id} - ${
    deal.name
  } - Error: ${error}\n`;
  fs.appendFileSync(logPath, logEntry, "utf8");
}
