import axios from 'axios';
import Vue from 'vue';
import { getToken } from "@/utils/app-util";
// 發送前的動作
axios.interceptors.request.use((config) => {
  const httpToken = localStorage.getItem('token');
  const resConfig = config;
  if (httpToken) {
    resConfig.headers.token = httpToken;
  }
  return config;
}, (error) => {
  const value = error;
  return Promise.reject(value);
});
// 接收響應前的動作
axios.interceptors.response.use((response) => {
  const res = response;
  return res;
}, (error) => {
  const value = error.response;
  return Promise.resolve(value);
});
export default {
  post(url, value) {
    const params = {
      method: 'POST',
      baseURL: Vue.prototype.baseURL,
      url,
      data: value,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': getToken() === '' ? 'Bearer Guest' : `Bearer ${getToken()}`,
        'x-api-key': '2474a81441af5d3b387197f597ef4310c5d9336bdac95c2870c98438d9e42ac28c210dc7eedcecf8603ecc8d2a7ca517218f45e514e7a7ae431610c248656591fac8d3317703eea77bf4f5d59278a803e727f85500d499eb1da8775fd1c5ec683ec3fd1ab4ae94836df55eadfef05bc536922858e6c9a2ce01ea06ac0dd90542'
      },
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    })
  },
  put(url, value) {
    const params = {
      method: 'PUT',
      baseURL: Vue.prototype.baseURL,
      url,
      data: value,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': getToken() === '' ? 'Bearer Guest' : `Bearer ${getToken()}`,
        'x-api-key': '2474a81441af5d3b387197f597ef4310c5d9336bdac95c2870c98438d9e42ac28c210dc7eedcecf8603ecc8d2a7ca517218f45e514e7a7ae431610c248656591fac8d3317703eea77bf4f5d59278a803e727f85500d499eb1da8775fd1c5ec683ec3fd1ab4ae94836df55eadfef05bc536922858e6c9a2ce01ea06ac0dd90542'
      },
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
  get(url) {
    const params = {
      method: 'GET',
      baseURL: Vue.prototype.baseURL,
      url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': getToken() === '' ? 'Bearer Guest' : `Bearer ${getToken()}`,
        'x-api-key': '2474a81441af5d3b387197f597ef4310c5d9336bdac95c2870c98438d9e42ac28c210dc7eedcecf8603ecc8d2a7ca517218f45e514e7a7ae431610c248656591fac8d3317703eea77bf4f5d59278a803e727f85500d499eb1da8775fd1c5ec683ec3fd1ab4ae94836df55eadfef05bc536922858e6c9a2ce01ea06ac0dd90542'
      },
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
  delete(url) {
    const params = {
      method: 'DELETE',
      baseURL: Vue.prototype.baseURL,
      url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': getToken() === '' ? 'Bearer Guest' : `Bearer ${getToken()}`,
        'x-api-key': '2474a81441af5d3b387197f597ef4310c5d9336bdac95c2870c98438d9e42ac28c210dc7eedcecf8603ecc8d2a7ca517218f45e514e7a7ae431610c248656591fac8d3317703eea77bf4f5d59278a803e727f85500d499eb1da8775fd1c5ec683ec3fd1ab4ae94836df55eadfef05bc536922858e6c9a2ce01ea06ac0dd90542'
      },
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
};