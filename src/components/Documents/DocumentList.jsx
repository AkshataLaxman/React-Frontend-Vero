import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { documentAPI } from '../../services/api';
import UploadDocument from './UploadDocument';
import Loading from '../Common/Loading';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getAll();
      setDocuments(response.data);
      setFilteredDocs(response.data);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredDocs(documents);
    } else {
      setFilteredDocs(documents.filter((doc) => doc.status === filter));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentAPI.delete(id);
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document');
      console.error(err);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchDocuments();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Documents</h1>
        <div className="page-actions">
          <button className="btn-secondary">
            <Search size={20} />
            Search
          </button>
          <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
            <Plus size={20} />
            Add Document
          </button>
        </div>
      </div>

      <div className="filters-bar">
        {['All', 'Verified', 'Pending', 'Rejected'].map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Date of Registration</th>
              <th>Project Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <Link to={`/documents/${doc.id}`} className="client-name">
                    {doc.clientName}
                  </Link>
                </td>
                <td>{doc.dateRegistered}</td>
                <td>{doc.projectName}</td>
                <td>
                  <span className={`status-badge ${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Delete"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <UploadDocument
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default DocumentList;