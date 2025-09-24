import React, { useState } from "react"
import { Sparkles, Image } from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios";
import { toast } from "react-hot-toast"

// Set base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {
  const stylelength = [
    { text: "Realistic" },
    { text: "Ghibli style" },
    { text: "Anime Style" },
    { text: "Cartoon Style" },
    { text: "Fantasy Style" },
  ]

  const [selectedCategory, setSelectedCategory] = useState(stylelength[0])
  const [input, setInput] = useState("")
  const [publish, setPublish] = useState(false)
  const [generatedImg, setGeneratedImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const onsubmitHandler = async (e) => {
    e.preventDefault()
    
    if (!input.trim()) {
      toast.error("Please enter a description for your image")
      return
    }
    
    setLoading(true)

    try {
      const prompt = `${input} in ${selectedCategory.text} style`
      console.log("🎨 Generating image with prompt:", prompt)

      const { data } = await axios.post(
        "/api/ai/image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      console.log("📡 API Response:", data)

      if (data.success) {
        setGeneratedImg(data.content)
        toast.success("Image generated successfully!")
      } else {
        console.error("API Error:", data.message)
        toast.error(data.message || "Failed to generate image")
      }
    } catch (err) {
      console.error("Error generating image:", err)
      
      if (err.response) {
        console.error("Response status:", err.response.status)
        console.error("Response data:", err.response.data)
        
        const errorMessage = err.response.data?.message || 
                           `Server error (${err.response.status}). Please try again.`
        toast.error(errorMessage)
      } else if (err.request) {
        toast.error("Network error. Please check your connection and try again.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left col */}
      <form
        onSubmit={onsubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        {/* Describe Image */}
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        {/* Style */}
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {stylelength.map((item, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition 
                ${
                  selectedCategory.text === item.text
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-white text-green-700 border-gray-300"
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Toggle */}
        <div className="my-6 flex items-center gap-2">
          <label className="relative inline-block w-9 h-5 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            {/* Track */}
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            {/* Knob */}
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image public</p>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
             bg-gradient-to-r from-[#00AD25] to-[#04FF50] 
             text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image className="w-5" />
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {/* Image / Placeholder */}
        <div className="flex-1 flex justify-center items-center">
          {generatedImg ? (
            <img
              src={generatedImg}
              alt="Generated"
              className="max-w-full max-h-[400px] rounded-md shadow-md"
            />
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>Enter a topic and click “Generate image" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImage
