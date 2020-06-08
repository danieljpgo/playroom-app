import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.56:3333',
});

// @TODO Criar um serviço generico para o axios

export default api;
