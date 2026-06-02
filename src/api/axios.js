import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:8888',
  baseURL: 'http://1204.firedogs.co.kr:8888',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert('로그인이 만료되었습니다.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;