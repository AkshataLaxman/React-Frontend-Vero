import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Briefcase, Edit2, Trash2, Eye, List, Grid } from 'lucide-react';
import { documentAPI } from '../../services/api';
import Loading from '../Common/Loading';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocumentDetail();
  }, [id]);

  const fetchDocumentDetail = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getById(id);
      setDetail(response.data);
    } catch (err) {
      setError('Failed to load document details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentAPI.delete(docId);
      alert('Document deleted successfully');
      if (detail.documents.length === 1) {
        navigate('/documents');
      } else {
        fetchDocumentDetail();
      }
    } catch (err) {
      alert('Failed to delete document');
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!detail) return <div>Document not found</div>;

  return (
    <div>
      <button className="btn-secondary" onClick={() => navigate('/documents')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="detail-header">
        <div className="detail-header-content">
          <img
            src={`https://ui-avatars.com/api/?name=${detail.clientName}&background=0066FF&color=fff&size=80`}
            alt={detail.clientName}
            className="detail-avatar"
          />
          <div className="detail-info">
            <h2>{detail.clientName}</h2>
            <p>{detail.email}</p>
            <div className="detail-meta">
              <div className="detail-meta-item">
                <MapPin size={16} />
                {detail.location || 'New York'}
              </div>
              <div className="detail-meta-item">
                <Briefcase size={16} />
                {detail.projectName}
              </div>
              <div className="detail-meta-item">
                <Phone size={16} />
                {detail.phone || '9848092919'}
              </div>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <Edit2 size={20} />
            </button>
            <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <div className="section-header">
          <h3 className="section-title">Documents</h3>
          <div className="view-toggle">
            <button
              className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`icon-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="data-table">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Uploaded On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {detail.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.uploadedOn}</td>
                  <td>
                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="View">
                        <Eye size={16} />
                      </button>
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
      </div>
    </div>
  );
};

export default DocumentDetail;