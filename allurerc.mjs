import { defineConfig } from "allure";

export default defineConfig({
  name: "Reporte Allure",                 // título del reporte
  output: "./allure-report",              // carpeta donde se genera la página
  historyPath: "./allure-history.jsonl",  // archivo donde se acumula el historial de corridas
});