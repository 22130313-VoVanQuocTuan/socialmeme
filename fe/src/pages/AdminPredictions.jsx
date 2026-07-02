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
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminPredictions() {
  const [preds, setPreds] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getPredictions(50, 0);
        setPreds(data.predictions || []);
        const s = await getPredictionStats(7);
        setStats(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={24} />
            <span className="text-2xl font-bold text-purple-600">Quản lý dự báo</span>
          </div>
          <Link to="/admin" className="text-gray-500 hover:text-purple-600 transition flex items-center gap-2 font-medium">
            <ArrowLeft size={18} /> Quay lại
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thống kê dự báo (7 ngày gần nhất)</h2>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <p className="text-sm text-blue-600 font-semibold">Tổng dự báo</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <p className="text-sm text-green-600 font-semibold">Đã đánh giá</p>
                <p className="text-3xl font-bold text-green-900">{stats.evaluated}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                <p className="text-sm text-amber-600 font-semibold">Đúng</p>
                <p className="text-3xl font-bold text-amber-900">{stats.correct}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <p className="text-sm text-purple-600 font-semibold">Độ chính xác</p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.accuracy ? (stats.accuracy * 100).toFixed(1) + '%' : 'N/A'}
                </p>
              </div>
            </div>
          )}

          <div style={{ width: '100%', marginBottom: 20 }}>
            <Line options={options} data={chartData()} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết dự báo</h2>
            <p className="text-sm text-gray-500 mt-1">50 dự báo gần nhất</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Meme ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời gian dự báo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Xác suất</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dự báo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thực tế</th>
                </tr>
              </thead>
              <tbody>
                {preds.length > 0 ? (
                  preds.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded">{p.meme_id}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(p.predicted_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                        {(p.hot_probability * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          p.is_predicted_hot 
                            ? 'bg-orange-50 text-orange-700' 
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          {p.is_predicted_hot ? '🔥 Hot' : '❄️ Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {p.actually_hot === null ? (
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700 font-semibold">
                            ⏳ Pending
                          </span>
                        ) : p.actually_hot ? (
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 font-semibold">
                            ✓ Hot
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 font-semibold">
                            ✗ Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Không có dự báo nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
