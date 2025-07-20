import axios from "axios";

const baseURL = 'http://13.221.69.243:8000'

export const api = axios.create({
    baseURL: baseURL,
});
