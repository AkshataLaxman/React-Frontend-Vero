import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { documentAPI } from '../../services/api';

const UploadDocument = ({ onClose, onSuccess }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    phone: '',
    location: '',
    email: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.clientName || !formData.projectName) {
      setError('Client name and project name are required');
      return;
    }

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('clientName', formData.clientName);
      uploadFormData.append('projectName', formData.projectName);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('location', formData.location);
      uploadFormData.append('email', formData.email);

      await documentAPI.upload(uploadFormData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Upload Document</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div
            className={`upload-area ${dragActive ? 'dragover' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="upload-icon" size={48} />
            <div className="upload-text">
              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
            </div>
            <div className="upload-hint">PDF, DOC, DOCX, XLS, XLSX (max. 16MB)</div>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientName">Client Name *</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              className="form-control"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectName">Project Name *</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              className="form-control"
              placeholder="Enter project name"
              value={formData.projectName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="client@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="9848092919"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              placeholder="New York"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;