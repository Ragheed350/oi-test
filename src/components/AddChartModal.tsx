import React, { useState } from "react"
import { DynamicChartConfig } from "../types"
import { ChartType, ChartTypeRegistry } from "chart.js"

type Props = {
  closeModal: () => void
  addChart: (chartConfig: DynamicChartConfig) => void
}

const chartTypes = ["bar", "line", "scatter", "bubble", "pie", "doughnut", "polarArea", "radar"]

export default function AddChartModal({ closeModal, addChart }: Props) {
  const [data, setData] = useState<Record<string, any>>({})
  const [chartType, setchartType] = useState<ChartType>("bar")
  const [labels, setLabels] = useState<string[]>([])
  const [datasets, setDatasets] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleChangeChartType = (value: React.ChangeEvent<HTMLSelectElement>) => {
    setchartType(value.currentTarget.value as ChartType)
  }

  const handleAddLabel = () => {
    if (data.label && !labels.includes(data.label)) {
      setLabels([...labels, data.label])
      setData({ ...data, label: "" }) // Clear input field after adding label
    }
  }

  const handleAddDataset = () => {
    if (data.datasetLabel && data.datasetData) {
      const newDataset = {
        label: data.datasetLabel,
        backgroundColor: "rgba(75,192,192,0.3)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: data.datasetData.split(",").map((value: any) => parseFloat(value.trim())),
      }
      setDatasets([...datasets, newDataset])
      setData({ ...data, datasetLabel: "", datasetData: "" }) // Clear input fields after adding dataset
    }
  }

  const handleConfirm = () => {
    const options = {
      maintainAspectRatio: false,
      plugins: { title: { display: true, text: data["title"] } },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }

    const chartConfig: DynamicChartConfig = {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options,
    }

    addChart(chartConfig)
    closeModal()
  }

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Chart Configuration</h2>
          <label>Chart Type:</label>
          <select name="type" id="type" value={chartType} onChange={handleChangeChartType}>
            {chartTypes.map((type) => (
              <option value={type.toLocaleLowerCase()}>{type.toUpperCase()}</option>
            ))}
          </select>

          <label>Title:</label>
          <input type="text" name="title" onChange={handleChange} />
          <label>Labels:</label>
          <div>
            <input type="text" name="label" value={data.label} onChange={handleChange} />
            <button onClick={handleAddLabel}>Add Label</button>
          </div>
          <ul>
            {labels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
          <label>Datasets:</label>
          <div>
            <input type="text" name="datasetLabel" value={data.datasetLabel} onChange={handleChange} placeholder="Label" />
            <input type="text" name="datasetData" value={data.datasetData} onChange={handleChange} placeholder="Data (comma-separated)" />
            <button onClick={handleAddDataset}>Add Dataset</button>
          </div>
          <ul>
            {datasets.map((dataset, index) => (
              <li key={index}>
                {dataset.label}: {dataset.data.join(", ")}
              </li>
            ))}
          </ul>
          <div className="actions">
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
