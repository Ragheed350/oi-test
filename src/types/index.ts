import { ChartConfiguration, ChartOptions, ChartTypeRegistry } from "chart.js/auto"

export interface DynamicChartConfig {
  type: keyof ChartTypeRegistry
  data: ChartConfiguration["data"]
  options: ChartOptions
}

export interface Series {
  realtime_start: string
  realtime_end: string
  seriess: Seriess[]
}

export interface Seriess {
  id: string
  realtime_start: string
  realtime_end: string
  title: string
  observation_start: string
  observation_end: string
  frequency: string
  frequency_short: string
  units: string
  units_short: string
  seasonal_adjustment: string
  seasonal_adjustment_short: string
  last_updated: string
  popularity: number
  notes: string
}
