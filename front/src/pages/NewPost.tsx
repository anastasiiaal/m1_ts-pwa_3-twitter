import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";

export default function NewPost() {
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!text.trim()) {
            setError("Post content is required.");
            setLoading(false);
            return;
        }

        try {
            await createPost({ text, image: image.trim() || undefined });
            navigate("/");
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📌 Create a new post</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">📝 Content</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                        placeholder="What's on your mind?"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">🖼️ Image</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                        placeholder="Paste an image link"
                    />
                </div>

                {image && (
                    <div className="mt-2">
                        <img
                            src={image}
                            alt="Preview"
                            className="max-h-24 rounded-lg shadow-md border"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-600 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-500 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Add post"}
                </button>
            </form>
        </div>
    );
}
