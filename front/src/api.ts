import axios from "axios";
import { openDB } from "idb";

const API_BASE_URL = "http://localhost:8081/api";

// store token locally
export function setAuthToken(token: string | null) {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
};

// get token from localStorage
export function getAuthToken() {
    return localStorage.getItem("token");
};

// register a new user
export async function registerUser(userData: { pseudo: string; email: string; password: string }) {
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

// login and get token
export async function loginUser(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};

// logout
export function logoutUser() {
    const token = getAuthToken();
    if (token) {
        axios.post(`${API_BASE_URL}/auth/logout`, { token });
        setAuthToken(null);
    }
};

// get all posts
export async function fetchPosts() {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// get posts by user id
export async function fetchUserPosts(userId: number) {
    try {
        const response = await fetch(`http://localhost:8081/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error("Failed to fetch user posts");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Failed to load user's posts.");
    }
};

// create a new post
export async function createPost(postData: { text: string; image?: string }) {
    const token = getAuthToken();

    try {
        const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (!navigator.onLine) {
            console.warn("⚠️ User offline! Attempting to save post for later...");
            await saveForLater(postData);
        } else {
            console.error("❌ Error creating post:", error);
        }
        throw error;
    }
}


// ✅ Fix IndexedDB storage & background sync
async function saveForLater(data: { text: string; image?: string }) {
    const token = getAuthToken();

    const db = await openDB("offline-sync", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("posts")) {
                db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
            }
        }
    });

    // ✅ Check if the post already exists to prevent duplicates
    const existingPosts = await db.getAll("posts");
    const isDuplicate = existingPosts.some(
        (post) => post.text === data.text && post.image === data.image
    );

    if (isDuplicate) {
        console.warn("🚫 Post already saved for offline submission.");
        return;
    }

    await db.add("posts", { ...data, token, createdAt: new Date().toISOString() });

    // ✅ Register background sync once, not multiple times
    if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if ("sync" in registration) {
            await (registration as any).sync.register("sync-new-posts");
            console.log("🔄 Background sync registered.");
        } else {
            console.warn("⚠️ Background sync not supported.");
        }
    }
}

// Subscribe user to push notifications
export async function subscribeToNotifications(subscription: PushSubscription) {
    const token = getAuthToken();
    try {
        await axios.post(`${API_BASE_URL}/notifications/subscribe`, subscription, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Subscription saved to backend.");
        return true;
    } catch (error) {
        console.error("❌ Failed to save subscription:", error);
        return false;
    }
}

// All PUSH related ____________________

// Unsubscribe user from push notifications
export async function unsubscribeFromNotifications(endpoint: string) {
    const token = getAuthToken();
    try {
        await axios.post(`${API_BASE_URL}/notifications/unsubscribe`, { endpoint }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Subscription removed from backend.");
        return true;
    } catch (error) {
        console.error("❌ Failed to remove subscription:", error);
        return false;
    }
}

// Get all subscriptions for the current user
export async function getUserSubscriptions() {
    const token = getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/notifications/subscriptions`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch user subscriptions:", error);
        return [];
    }
}
