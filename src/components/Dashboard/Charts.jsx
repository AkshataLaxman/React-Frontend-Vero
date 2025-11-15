import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const VerificationTrendsChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Verifications',
        data: data.data,
        borderColor: '#0066FF',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export const ProjectTrendsChart = ({ data }) => {
  const chartData = {
    labels: ['Completed', 'Ongoing', 'Delayed'],
    datasets: [
      {
        data: [data.completed, data.ongoing, data.delayed],
        backgroundColor: ['#10B981', '#0066FF', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export const DocumentCategoryChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export const DocumentTypesChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};