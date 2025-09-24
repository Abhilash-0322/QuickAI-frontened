import React, { useState } from "react";
import { Hash, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Set base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const categories = [
    { text: "General" },
    { text: "Technology" },
    { text: "Business" },
    { text: "Health" },
    { text: "Lifestyle" },
    { text: "Education" },
    { text: "Travel" },
    { text: "Food" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [input, setInput] = useState("");
  const [titles, setTitles] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `Generate 5 creative blog titles for ${selectedCategory.text} category about: ${input}. Make them engaging and SEO-friendly.`;

      const { data } = await axios.post(
        "/api/ai/blogtitle",
        { prompt, length: 200 },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setTitles(data.content);
        toast.success("Blog titles generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate titles");
      }
    } catch (err) {
      console.error("Error generating titles:", err);
      toast.error("Something went wrong. Please try again.");
      setTitles("Failed to generate titles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onsubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        {/* Keyword Input */}
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="artificial intelligence, healthy recipes, etc."
          required
        />

        {/* Category Selection */}
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {categories.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition 
                ${
                  selectedCategory.text === item.text
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-slate-700 border-gray-300"
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <br />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
             bg-gradient-to-r from-[#226BFF] to-[#65ADFF] 
             text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          <Hash className="w-5" />
          {loading ? "Generating..." : "Generate Titles"}
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        {/* Result */}
        <div className="flex-1 flex justify-center items-center">
          {loading ? (
            <div className="text-sm text-gray-500">Generating titles...</div>
          ) : titles ? (
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{titles}</p>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter keywords and click "Generate Titles" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
