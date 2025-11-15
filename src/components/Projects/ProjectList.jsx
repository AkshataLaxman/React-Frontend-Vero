import { useState, useEffect } from 'react';
import { Plus, FolderKanban, Edit3, Trash2, UploadCloud, X } from 'lucide-react';
import { projectAPI } from '../../services/api';
import Loading from '../Common/Loading';
import { formatDate } from '../../utils/helpers';

const initialForm = { name: '', status: 'Ongoing', file: null };

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.getAll();
      setProjects(response.data || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setForm({ name: project.name || '', status: project.status || 'Ongoing', file: null });
    setIsEditing(true);
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] || null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      // Use FormData if there's a file to upload
      if (form.file) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('status', form.status);
        fd.append('file', form.file);
        if (isEditing) {
          await projectAPI.updateWithForm(editingId, fd);
        } else {
          await projectAPI.createWithForm(fd);
        }
      } else {
        const payload = { name: form.name, status: form.status };
        if (isEditing) {
          await projectAPI.update(editingId, payload);
        } else {
          await projectAPI.create(payload);
        }
      }

      // Refresh list
      await fetchProjects();
      setShowModal(false);
      setForm(initialForm);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      setActionLoading(true);
      await projectAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginTop: '12px' }}>{error}</div>}

      <div className="stats-grid" style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {projects.length === 0 && <div>No projects found. Create one to get started.</div>}
        {projects.map((project) => (
          <div key={project.id} className="stat-card" style={{ padding: '14px', borderRadius: '10px', boxShadow: 'var(--card-shadow)', background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className={`stat-icon ${project.status === 'Completed' ? 'green' : project.status === 'Delayed' ? 'red' : 'blue'}`} style={{ width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderKanban size={20} />
                </div>
                <div>
                  <div className="stat-title" style={{ fontWeight: 600 }}>{project.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Created: {project.createdAt ? formatDate(project.createdAt) : '-'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button title="Edit" onClick={() => openEdit(project)} className="btn-ghost" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <Edit3 size={16} />
                </button>
                <button title="Delete" onClick={() => handleDelete(project.id)} className="btn-ghost" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} disabled={actionLoading}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.95rem' }}>{project.status}</div>
              {project.fileUrl && (
                <a href={project.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <UploadCloud size={16} />
                  <span style={{ fontSize: '0.85rem' }}>Attachment</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="modal" style={{ width: 520, background: 'white', borderRadius: 10, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>{isEditing ? 'Edit Project' : 'Create Project'}</h3>
              <button onClick={() => setShowModal(false)} className="btn-ghost">
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Project name
                <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="e.g., Vendor KYC" />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Status
                <select name="status" value={form.status} onChange={handleChange} className="input">
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Delayed</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Attachment (optional)
                <input type="file" onChange={handleFileChange} />
                <small style={{ color: 'var(--muted)' }}>Attach a spec/brief or related file (optional)</small>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" onClick={() => { setShowModal(false); setForm(initialForm); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
                </button>
              </div>

              {error && <div style={{ color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
