import { useState } from "react"
import { registerables, Chart } from "chart.js"
import { DynamicChartConfig } from "./types"
import AddChartModal from "./components/AddChartModal"

Chart.register(...registerables)

function App() {
  const [chartInstances, setChartInstances] = useState<Chart[]>([])
  const [isModalOpen, setisModalOpen] = useState(false)

  const addChart = (chartConfig: DynamicChartConfig) => {
    const canvas = document.createElement("canvas")
    const div = document.createElement("div")

    div.appendChild(canvas)
    document.getElementById("charts-container")?.appendChild(div)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const newChartInstance = new Chart(ctx, {
      type: chartConfig.type,
      data: chartConfig.data,
      options: chartConfig.options,
    })

    setChartInstances([...chartInstances, newChartInstance])
    setisModalOpen(false)
  }

  const closeModal = () => {
    setisModalOpen(false)
  }

  return (
    <div id="charts-container">
      <button onClick={() => setisModalOpen(true)}>Add Chart</button>
      {isModalOpen && <AddChartModal closeModal={closeModal} addChart={addChart} />}
      {/* Rendered canvas elements will be appended to the DOM */}
    </div>
  )
}

export default App
