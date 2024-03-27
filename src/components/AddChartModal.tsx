import { DynamicChartConfig } from "../types"
import useAddChart from "../utilities/hooks/useAddChart"

type Props = {
  closeModal: () => void
  addChart: (chartConfig: DynamicChartConfig) => void
}

export default function AddChartModal({ closeModal, addChart }: Props) {
  const {
    chartTypes,
    data,
    chartType,
    labels,
    datasets,
    dataSource,
    handleChange,
    handleChangeChartType,
    handleAddLabel,
    handleAddDataset,
    handleConfirm,
    handleChangeDataSource,
  } = useAddChart({ closeModal, addChart })

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Chart Configuration</h2>
          <label>Data Source:</label>
          <select name="source" id="source" value={dataSource} onChange={handleChangeDataSource}>
            <option value={"series"}>Series API</option>
            <option value={"custome"}>Custome</option>
          </select>

          <label>Chart Type:</label>
          <select name="type" id="type" value={chartType} onChange={handleChangeChartType}>
            {chartTypes.map((type) => (
              <option value={type.toLocaleLowerCase()}>{type.toUpperCase()}</option>
            ))}
          </select>

          {dataSource === "custome" ? (
            <>
              <label>Title:</label>
              <input type="text" name="title" onChange={handleChange} />
              {chartType === "line" && (
                <>
                  <label>Line Style:</label>
                  <select name="lineStyle" onChange={handleChange}>
                    <option value={"filled"}>Filled</option>
                    <option value={"unfilled"}>Unfilled</option>
                    <option value={"dashed"}>Dashed</option>
                  </select>
                </>
              )}
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
              <div className="datasets">
                <input type="text" name="datasetLabel" value={data.datasetLabel} onChange={handleChange} placeholder="Label" />
                <input
                  type="text"
                  name="datasetData"
                  value={data.datasetData}
                  onChange={handleChange}
                  placeholder="Data (comma-separated)"
                />
              </div>
              <button onClick={handleAddDataset}>Add Dataset</button>
              <ul>
                {datasets.map((dataset, index) => (
                  <li key={index}>
                    {dataset.label}: {dataset.data.join(", ")}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="appearance">
            <h4>Appearance</h4>

            {["line", "bar"].includes(chartType) && (
              <div className="axis">
                <label>
                  Yaxis Label:
                  <input type="text" name="xTitle" onChange={handleChange} />
                </label>

                <label>
                  Xaxis Label:
                  <input type="text" name="yTitle" onChange={handleChange} />
                </label>
              </div>
            )}

            <div className="colors">
              <label>
                Background Color:
                <input type="color" name="bgColor" onChange={handleChange} />
              </label>

              <label>
                Border Color:
                <input type="color" name="borderColor" onChange={handleChange} />
              </label>
            </div>
          </div>
          <div className="actions">
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
