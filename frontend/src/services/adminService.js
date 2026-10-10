import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getAllRegistrations(params = {}) {
    const response = await api.get('/admin/registrations', { params });
    return response.data;
  },

  async getEventRegistrations(eventId) {
    const response = await api.get(`/admin/events/${eventId}/registrations`);
    return response.data;
  },

  async getAllParticipants(search = '') {
    const response = await api.get('/admin/participants', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  async getAttendanceReports() {
    const response = await api.get('/admin/reports/attendance');
    return response.data;
  },

  async checkInAttendance(qrToken) {
    const response = await api.post('/admin/attendance/check-in', { qrToken });
    return response.data;
  },
};

export default adminService;
