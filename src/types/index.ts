import { ChartConfiguration, ChartOptions, ChartTypeRegistry } from "chart.js/auto"

export interface DynamicChartConfig {
  type: keyof ChartTypeRegistry
  data: ChartConfiguration["data"]
  options: ChartOptions
}
