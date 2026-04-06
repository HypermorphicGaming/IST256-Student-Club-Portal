import { useState, useEffect } from 'react';

function ManageUsers() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    gradeLevel: ''
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('club_users') || '[]');
    setUsers(storedUsers);
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = `${name === 'firstName' ? 'First' : 'Last'} name is required.`;
        else if (value.length < 2) error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters.`;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'phone':
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'Please enter a valid 10-digit phone number.';
        break;
      case 'organization':
        if (!value.trim()) error = 'Organization is required.';
        break;
      case 'gradeLevel':
        if (!value) error = 'Grade level is required.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = { ...formData, id: Date.now() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('club_users', JSON.stringify(updatedUsers));
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      gradeLevel: ''
    });
    setErrors({});
    setMessage('User details saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      gradeLevel: ''
    });
    setErrors({});
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.organization}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container my-5 p-5">
        <div className="card p-4 mb-4">
          <h2 className="text-center mb-2">Manage Users</h2>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">First name <strong className="text-danger">*</strong></label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : formData.firstName && !errors.firstName ? 'is-valid' : ''}`}
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last name <strong className="text-danger">*</strong></label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : formData.lastName && !errors.lastName ? 'is-valid' : ''}`}
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email <strong className="text-danger">*</strong></label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : formData.phone && !errors.phone ? 'is-valid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="organization" className="form-label">Organization <strong className="text-danger">*</strong></label>
              <input
                type="text"
                className={`form-control ${errors.organization ? 'is-invalid' : formData.organization && !errors.organization ? 'is-valid' : ''}`}
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.organization && <div className="text-danger">{errors.organization}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="gradeLevel" className="form-label">Grade Level <strong className="text-danger">*</strong></label>
              <select
                className={`form-select ${errors.gradeLevel ? 'is-invalid' : formData.gradeLevel && !errors.gradeLevel ? 'is-valid' : ''}`}
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose...</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
              {errors.gradeLevel && <div className="text-danger">{errors.gradeLevel}</div>}
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">Add User</button>
              <button className="btn btn-secondary" type="reset" onClick={handleReset}>Clear Form</button>
            </div>
          </form>
        </div>

        {message && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Status:</strong> {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
          </div>
        )}
      </div>

      <div className="container mt-1 mb-5 p-5 text-center">
        <h3 className="mb-3">User Directory</h3>
        <input
          type="text"
          id="searchInput"
          className="form-control mb-3"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="my-5" id="userCard">
          {filteredUsers.length === 0 ? (
            <p>No users registered yet.</p>
          ) : (
            <div className="row">
              {filteredUsers.map(user => (
                <div key={user.id} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                      <p className="card-text">
                        <strong>Email:</strong> {user.email}<br/>
                        <strong>Phone:</strong> {user.phone || 'N/A'}<br/>
                        <strong>Organization:</strong> {user.organization}<br/>
                        <strong>Grade Level:</strong> {user.gradeLevel}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto d-flex align-items-center justify-content-center">
        <p className="mb-0">&copy; 2026 Student Club Portal | IST 256 Group 1</p>
      </footer>
    </div>
  );
}

export default ManageUsers;