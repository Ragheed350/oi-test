import { ChartData, ChartDataset, ChartOptions, ChartType } from "chart.js"
import React, { useEffect, useState } from "react"
import { DynamicChartConfig, Series } from "../../types"
import { API_KEY, chartTypes } from "../constants"
import axios from "axios"

type Props = {
  closeModal: () => void
  addChart: (chartConfig: DynamicChartConfig) => void
}

const fetchSeriesData = async () => {
  const res = await axios.get<Series>(`https://api.stlouisfed.org/fred/series?series_id=GNPCA&api_key=${API_KEY}&file_type=json`)
  return res.data.seriess
}

export default function useAddChart({ addChart, closeModal }: Props) {
  const [data, setData] = useState<Record<string, any>>({})
  const [chartType, setchartType] = useState<ChartType>("bar")
  const [labels, setLabels] = useState<string[]>([])
  const [datasets, setDatasets] = useState<any[]>([])
  const [dataSource, setdataSource] = useState<"custome" | "series">("custome")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleChangeChartType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setchartType(e.currentTarget.value as ChartType)
  }

  const handleAddLabel = () => {
    if (data.label && !labels.includes(data.label)) {
      setLabels([...labels, data.label])
      setData({ ...data, label: "" }) // Clear input field after adding label
    }
  }

  const handleAddDataset = () => {
    if (data.datasetLabel && data.datasetData) {
      const newDataset: ChartDataset = {
        label: data.datasetLabel,
        backgroundColor: data.bgColor,
        borderColor: data.borderColor,
        borderWidth: 1,
        data: data.datasetData.split(",").map((value: any) => parseFloat(value.trim())),
        fill: data.lineStyle === "filled" ? true : false,
        borderDash: data.lineStyle === "dashed" ? [5, 5] : [],
      }
      setDatasets([...datasets, newDataset])
      setData({ ...data, datasetLabel: "", datasetData: "" }) // Clear input fields after adding dataset
    }
  }

  const handleChangeDataSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setdataSource(e.target.value as any)
  }

  const handleConfirm = async () => {
    let seriesData
    let seriesDataset
    if (dataSource === "series") {
      seriesData = await fetchSeriesData()
      seriesDataset = [
        {
          label: seriesData?.[0].title,
          backgroundColor: data.bgColor,
          borderColor: data.borderColor,
          borderWidth: 1,
          data: seriesData?.map((value) => value.popularity),
          fill: data.lineStyle === "filled" ? true : false,
          borderDash: data.lineStyle === "dashed" ? [5, 5] : [],
        },
      ]
    }

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins: { title: { display: true, text: seriesData ? "fred/series" : data["title"] } },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: data.xTitle,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: data.yTitle,
          },
        },
      },
    }

    const chartConfig: DynamicChartConfig = {
      type: chartType,
      data: {
        labels: seriesData ? seriesData.map((series) => series.last_updated) : labels,
        datasets: seriesDataset ?? datasets,
      },
      options,
    }

    if (chartConfig.data.labels?.length !== 0 && chartConfig.data.datasets.length !== 0) {
      addChart(chartConfig)
      closeModal()
    } else {
      alert("Please fill the chart configuration")
    }
  }

  return {
    chartTypes,
    data,
    chartType,
    labels,
    datasets,
    dataSource,
    setData,
    setchartType,
    setLabels,
    setDatasets,
    handleChange,
    handleChangeChartType,
    handleAddLabel,
    handleAddDataset,
    handleConfirm,
    handleChangeDataSource,
  }
}
