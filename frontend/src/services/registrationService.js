import api from './api';

export const registrationService = {
  async registerForEvent(eventId) {
    const response = await api.post(`/registrations/events/${eventId}`);
    return response.data;
  },

  async getMyRegistrations() {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  async getRegistrationById(id) {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  },

  async cancelRegistration(id) {
    const response = await api.delete(`/registrations/${id}`);
    return response.data;
  },
};

export default registrationService;
