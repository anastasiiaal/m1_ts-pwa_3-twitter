import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// get all posts
export async function fetchPosts () {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch posts");
    }
};

