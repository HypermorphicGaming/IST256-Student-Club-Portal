export const createEmptyUserForm = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  organization: '',
  gradeLevel: ''
});

export const createUserForm = (user = {}) => ({
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  phone: user.phone || '',
  organization: user.organization || '',
  gradeLevel: user.gradeLevel || ''
});

export const createEmptyEventForm = () => ({
  eventName: '',
  eventCategory: '',
  eventDuration: 60,
  eventDate: '',
  eventTime: '',
  eventCost: 0,
  openSeats: '',
  locationRoomNumber: '',
  eventDescription: ''
});

export const createEventForm = (event = {}) => ({
  eventName: event.eventName || '',
  eventCategory: event.eventCategory || '',
  eventDuration: event.eventDuration || 60,
  eventDate: event.eventDate || '',
  eventTime: event.eventTime || '',
  eventCost: event.eventCost ?? 0,
  openSeats: event.openSeats ?? '',
  locationRoomNumber: event.locationRoomNumber || '',
  eventDescription: event.eventDescription || ''
});