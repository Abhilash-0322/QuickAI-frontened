import React, { useState } from "react";
import { Edit, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";   // ✅ Clerk hook
import axios from "axios";
import { toast } from "react-hot-toast";

// ✅ Set base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [article, setArticle] = useState("");   // ✅ to store response
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `write an article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "/api/ai/WriteArticle",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setArticle(data.content);
      } else {
        toast.error("Failed to generate article");
      }
    } catch (err) {
      console.error("Error generating article:", err);
      toast.error("Something went wrong. Please try again.");
      setArticle("Failed to generate article. Please try again.");
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
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        {/* Article Topic */}
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        {/* Article Length */}
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition 
                ${
                  selectedLength.length === item.length
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
          <Edit className="w-5" />
          {loading ? "Generating..." : "Generate Article"}
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {/* Result */}
        <div className="flex-1 flex justify-center items-center">
          {article ? (
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{article}</p>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click “Generate Article” to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
