import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// store token locally
export function setAuthToken (token: string | null) {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
};

// get token from localStorage
export function getAuthToken () {
    return localStorage.getItem("token");
};

// register a new user
export async function registerUser (userData: { pseudo: string; email: string; password: string }) {
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

// login and get token
export async function loginUser (credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};

// logout
export function logoutUser () {
    const token = getAuthToken();
    if (token) {
        axios.post(`${API_BASE_URL}/auth/logout`, { token });
        setAuthToken(null);
    }
};

// get all posts
export async function fetchPosts () {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// get posts by user id
export const fetchUserPosts = async (userId: number) => {
    const response = await fetch(`http://localhost:8081/api/posts/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user posts");
    return response.json();
};


// create a new post
export async function createPost (postData: { text: string; image?: string }) {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
