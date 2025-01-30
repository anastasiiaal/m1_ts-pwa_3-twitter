import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../api";

interface Post {
    id: number;
    text: string;
    image?: string;
    createdAt: string;
    author?: { pseudo: string, id: number };
}

export default function Index() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [sortOrder, setSortOrder] = useState<"NEW" | "OLD">("NEW");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchPosts();
                const sortedPosts = [...data].sort((a, b) =>
                    sortOrder === "NEW"
                        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                setPosts(sortedPosts);
            } catch (err) {
                setError("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [sortOrder]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 mb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Latest Posts</h2>
                <Link to="/new-post" className="bg-slate-600 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-500">
                    ＋ New Post
                </Link>
            </div>

            <div className="flex mb-4 space-x-4">
                <button
                    onClick={() => setSortOrder("NEW")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === "NEW"
                            ? "bg-slate-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    🔥 Newest
                </button>
                <button
                    onClick={() => setSortOrder("OLD")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === "OLD"
                            ? "bg-slate-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    🕒 Oldest
                </button>
            </div>

            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="p-5 bg-white rounded-lg shadow-md flex flex-col space-y-3 border border-gray-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                                    👤
                                </div>
                                <div>
                                    <Link to={`feed/${post.author?.pseudo}`} className="font-medium text-gray-900">
                                        {post.author?.pseudo || "Unknown"}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {post.image && (
                                <div className="rounded-lg overflow-hidden border border-gray-300">
                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="w-full object-cover max-h-80"
                                    />
                                </div>
                            )}

                            <p className="text-gray-800 text-lg">{post.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">😞 No posts yet</p>
                )}
            </div>
        </div>
    );
}
