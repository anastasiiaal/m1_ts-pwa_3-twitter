import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserPosts } from "../api";

interface Post {
    id: number;
    text: string;
    image?: string;
    createdAt: string;
    author?: { pseudo: string; id: number };
}

export default function UserFeed() {
    const { id } = useParams<{ id: string }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userNotFound, setUserNotFound] = useState<boolean>(false); // whether user exists

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                setLoading(true);
                setUserNotFound(false);
                setError(null);

                const data = await fetchUserPosts(Number(id));
                if (data === null) {
                    setUserNotFound(true);
                    return;
                }

                setPosts(data);
            } catch (err) {
                setError("Failed to load user's posts.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadUserPosts();
        }
    }, [id]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;

    if (userNotFound)
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-bold text-slate-700 mb-2">User Not Found</h2>
                <p className="text-gray-500">The user with ID {id} does not exist.</p>
                <Link to="/" className="mt-4 inline-block bg-slate-600 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-500">
                    Back to home
                </Link>
            </div>
        );

    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 mb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Posts by {posts[0]?.author?.pseudo || "Unknown author"}</h2>
                <Link to="/" className="bg-slate-500 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-400">
                    Back to home
                </Link>
            </div>

            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="p-5 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                                    👤
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {post.author?.pseudo || "Unknown"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {post.image && (
                                <div className="rounded-lg overflow-hidden border border-gray-300 mt-2">
                                    <img src={post.image} alt="Post" className="w-full object-cover max-h-80" />
                                </div>
                            )}

                            <p className="text-gray-800 text-lg mt-2">{post.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">😞 No posts by this user yet.</p>
                )}
            </div>
        </div>
    );
}
