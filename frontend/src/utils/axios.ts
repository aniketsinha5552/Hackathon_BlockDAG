import axios from "axios";

const baseURL = 'https://metadag.duckdns.org'

export const api = axios.create({
    baseURL: baseURL,
});
