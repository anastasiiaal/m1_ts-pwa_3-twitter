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

export async function createPost (postData: { author: string; text: string; url?: string | null }) {
    try {
        await axios.post(`${API_BASE_URL}/posts`, postData);
    } catch (error: any) {
        console.error("Error creating post:", error.response ? error.response.data : error.message);
        throw new Error("Failed to create post");
    }
};
