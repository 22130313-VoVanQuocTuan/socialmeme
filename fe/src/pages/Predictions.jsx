import { useEffect, useState } from 'react';
import { getPredictions, getPredictionStats } from '../service/predictionApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Predictions() {
  const [preds, setPreds] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPredictions(50, 0);
        setPreds(data.predictions || []);
        const s = await getPredictionStats(7);
        setStats(s);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const chartData = () => {
    if (!stats || !stats.per_day) return { labels: [], datasets: [] };
    const labels = stats.per_day.map((d) => d.date);
    const accuracy = stats.per_day.map((d) => (d.accuracy !== null ? (d.accuracy * 100) : null));
    const evaluated = stats.per_day.map((d) => d.evaluated);

    return {
      labels,
      datasets: [
        {
          label: 'Accuracy (%)',
          data: accuracy,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          yAxisID: 'y',
          tension: 0.2,
        },
        {
          label: 'Evaluated Count',
          data: evaluated,
          borderColor: 'rgba(53,162,235,1)',
          backgroundColor: 'rgba(53,162,235,0.2)',
          yAxisID: 'y1',
          tension: 0.2,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    stacked: false,
    scales: {
      y: { type: 'linear', position: 'left', min: 0, max: 100, title: { display: true, text: 'Accuracy %' } },
      y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Evaluated' } },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Predictions</h2>
      {stats && (
        <div style={{ marginBottom: 12 }}>
          <strong>Total predicted (7d):</strong> {stats.total} &nbsp;|
          <strong> Evaluated:</strong> {stats.evaluated} &nbsp;|
          <strong> Correct:</strong> {stats.correct} &nbsp;|
          <strong> Accuracy:</strong> {stats.accuracy ? (stats.accuracy * 100).toFixed(1) + '%' : 'N/A'}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 900, marginBottom: 20 }}>
        <Line options={options} data={chartData()} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Meme ID</th>
            <th>Predicted At</th>
            <th>Prob</th>
            <th>Predicted Hot</th>
            <th>Actually Hot</th>
          </tr>
        </thead>
        <tbody>
          {preds.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{p.id}</td>
              <td>{p.meme_id}</td>
              <td>{new Date(p.predicted_at).toLocaleString()}</td>
              <td>{(p.hot_probability * 100).toFixed(1)}%</td>
              <td>{p.is_predicted_hot ? 'Yes' : 'No'}</td>
              <td>{p.actually_hot === null ? 'Pending' : p.actually_hot ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
