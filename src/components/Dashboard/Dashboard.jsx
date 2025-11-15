import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, XCircle, FolderKanban, FileCheck } from 'lucide-react';
import StatCard from './StatCard';
import {
  VerificationTrendsChart,
  ProjectTrendsChart,
  DocumentCategoryChart,
  DocumentTypesChart,
} from './Charts';
import { dashboardAPI } from '../../services/api';
import Loading from '../Common/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes, docsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData(),
        dashboardAPI.getRecentDocuments(),
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setRecentDocs(docsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="stats-grid">
        <StatCard
          icon={FolderKanban}
          title="Total Projects"
          value={stats?.totalProjects || 0}
          trend="+5%"
          iconBg="blue"
          iconColor="#0066FF"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Projects"
          value={stats?.completedProjects || 0}
          trend="+5%"
          iconBg="green"
          iconColor="#10B981"
        />
        <StatCard
          icon={FileText}
          title="Total Documents"
          value={stats?.totalDocuments || 0}
          trend="+5%"
          iconBg="blue"
          iconColor="#0066FF"
        />
        <StatCard
          icon={FileCheck}
          title="Verified Documents"
          value={stats?.verifiedDocuments || 0}
          trend="+5%"
          iconBg="yellow"
          iconColor="#F59E0B"
        />
        <StatCard
          icon={XCircle}
          title="Rejected Documents"
          value={stats?.rejectedDocuments || 0}
          trend="-2%"
          iconBg="red"
          iconColor="#EF4444"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Document Verification Trends</h3>
            <select className="chart-filter">
              <option>All</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          {chartData && <VerificationTrendsChart data={chartData.verificationTrends} />}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Project Trends</h3>
          </div>
          {chartData && <ProjectTrendsChart data={chartData.projectTrends} />}
        </div>
      </div>

      <div className="bottom-grid">
        <div className="data-card">
          <h3 className="data-card-title">Document Category</h3>
          {chartData && <DocumentCategoryChart data={chartData.documentCategories} />}
        </div>

        <div className="data-card">
          <h3 className="data-card-title">Recent Documents</h3>
          <div className="recent-documents">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-icon">
                  <FileText size={20} />
                </div>
                <div className="document-info">
                  <div className="document-name">{doc.name}</div>
                  <div className="document-date">{doc.uploadedOn}</div>
                </div>
                <span className={`status-badge ${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="data-card">
          <h3 className="data-card-title">Document Types</h3>
          {chartData && <DocumentTypesChart data={chartData.documentTypes} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;