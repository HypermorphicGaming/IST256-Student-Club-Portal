import { useState } from 'react'
import PageShell from './components/PageShell'
import { normalizeText, safeReadArray } from './utils/productUtils'
import { createRandomUser } from './utils/testDataUtils'
import useTimedMessage from './hooks/useTimedMessage'
import { createEmptyUserForm, createUserForm } from './utils/managementForms'

function ManageUsers() {
  const [formData, setFormData] = useState(() => createEmptyUserForm())
  const [users, setUsers] = useState(() => safeReadArray('club_users'))
  const [editingUserId, setEditingUserId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, showMessage, clearMessage] = useTimedMessage({ type: '', text: '' })
  const [errors, setErrors] = useState({})

  const normalizeUserDraft = (draft) => ({
    firstName: normalizeText(draft.firstName),
    lastName: normalizeText(draft.lastName),
    email: normalizeText(draft.email).toLowerCase(),
    phone: normalizeText(draft.phone),
    organization: normalizeText(draft.organization),
    gradeLevel: normalizeText(draft.gradeLevel),
  })

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = `${name === 'firstName' ? 'First' : 'Last'} name is required.`
        else if (value.length < 2)
          error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters.`
        break
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) error = 'Email is required.'
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.'
        break
      }
      case 'phone':
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, '')))
          error = 'Please enter a valid 10-digit phone number.'
        break
      case 'organization':
        if (!value.trim()) error = 'Organization is required.'
        break
      case 'gradeLevel':
        if (!value) error = 'Grade level is required.'
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalizedData = normalizeUserDraft(formData)
    const newErrors = {}
    Object.keys(normalizedData).forEach((key) => {
      const error = validateField(key, normalizedData[key])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const duplicateEmail = users.some(
      (user) =>
        user.id !== editingUserId &&
        normalizeText(user.email).toLowerCase() === normalizedData.email
    )
    if (duplicateEmail) {
      showMessage({ type: 'warning', text: 'A user with that email already exists.' })
      return
    }

    const updatedUsers = editingUserId
      ? users.map((user) => (user.id === editingUserId ? { ...user, ...normalizedData } : user))
      : [...users, { ...normalizedData, id: Date.now() }]

    setUsers(updatedUsers)
    localStorage.setItem('club_users', JSON.stringify(updatedUsers))
    setFormData(createEmptyUserForm())
    setEditingUserId(null)
    setErrors({})
    showMessage({
      type: 'success',
      text: editingUserId ? 'User updated successfully.' : 'User details saved successfully.',
    })
  }

  const handleReset = () => {
    setFormData(createEmptyUserForm())
    setEditingUserId(null)
    setErrors({})
  }

  const handleEditUser = (user) => {
    setFormData(createUserForm(user))
    setEditingUserId(user.id)
    setErrors({})
    showMessage({ type: 'info', text: 'Editing selected user.' })
  }

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('club_users', JSON.stringify(updatedUsers))

    if (editingUserId === userId) {
      handleReset()
    }

    showMessage({ type: 'success', text: 'User deleted successfully.' })
  }

  const handleGenerateTestUsers = () => {
    const generatedUsers = Array.from({ length: 3 }, () => createRandomUser())
    const updatedUsers = [...users, ...generatedUsers]
    setUsers(updatedUsers)
    localStorage.setItem('club_users', JSON.stringify(updatedUsers))
    showMessage({ type: 'success', text: `Generated ${generatedUsers.length} test users.` })
  }

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.organization}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell>
      <div className="container management-page__section">
        <div className="card p-4 mb-4">
          <h2 className="text-center mb-2">Manage Users</h2>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First name <strong className="text-danger">*</strong>
              </label>
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
              <label htmlFor="lastName" className="form-label">
                Last name <strong className="text-danger">*</strong>
              </label>
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
              <label htmlFor="email" className="form-label">
                Email <strong className="text-danger">*</strong>
              </label>
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
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
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
              <label htmlFor="organization" className="form-label">
                Organization <strong className="text-danger">*</strong>
              </label>
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
              <label htmlFor="gradeLevel" className="form-label">
                Grade Level <strong className="text-danger">*</strong>
              </label>
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

            <div className="col-12 d-flex flex-wrap gap-2">
              <button className="btn btn-primary" type="submit">
                {editingUserId ? 'Update User' : 'Add User'}
              </button>
              <button className="btn btn-secondary" type="reset" onClick={handleReset}>
                Clear Form
              </button>
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleGenerateTestUsers}
              >
                Generate Test Users
              </button>
            </div>
          </form>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            <strong>Status:</strong> {message.text}
            <button
              type="button"
              className="btn-close"
              onClick={clearMessage}
              aria-label="Close"
            ></button>
          </div>
        )}
      </div>

      <div className="container management-page__section management-page__directory text-center">
        <h3 className="mb-3">User Directory</h3>
        <input
          type="text"
          id="searchInput"
          className="form-control mb-3"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="management-page__results" id="userCard">
          {filteredUsers.length === 0 ? (
            <p>No users registered yet.</p>
          ) : (
            <div className="row">
              {filteredUsers.map((user) => (
                <div key={user.id} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {user.firstName} {user.lastName}
                      </h5>
                      <p className="card-text">
                        <strong>Email:</strong> {user.email}
                        <br />
                        <strong>Phone:</strong> {user.phone || 'N/A'}
                        <br />
                        <strong>Organization:</strong> {user.organization}
                        <br />
                        <strong>Grade Level:</strong> {user.gradeLevel}
                      </p>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

export default ManageUsers
