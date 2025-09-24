import React from 'react'
import { Sparkles, Eraser } from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import { toast } from "react-hot-toast"

// Set base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Removebackground = () => {
  const [input, setInput] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [resultImage, setResultImage] = React.useState("")

  const { getToken } = useAuth()

   const onsubmitHandler = async (e) => {
    e.preventDefault()
    if (!input) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post(
        "/api/ai/removeimage",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (data.success) {
        setResultImage(data.content)
        toast.success("Background removed successfully!")
      } else {
        toast.error(data.message || "Failed to remove background")
      }
    } catch (err) {
      console.error("Error removing background:", err)
      toast.error("Something went wrong. Please try again.")
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
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        {/* Article Topic */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept='image/*'
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
<p className='text-xs text-gray-500 font-light mt-1'>Supports JPG,PNG,and other image formats</p>
        

        <button
          type="submit"
          disabled={loading || !input}
          className="w-full flex justify-center items-center gap-2 
             bg-gradient-to-r from-[#F6AB41] to-[#FF4938] 
             text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eraser className="w-5 h-5" />
          {loading ? "Processing..." : "Remove Background"}
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {/* Image result or Empty state */}
        <div className="flex-1 flex justify-center items-center">
          {loading ? (
            <div className="text-sm text-gray-500">Processing image...</div>
          ) : resultImage ? (
            <img
              src={resultImage}
              alt="Background removed"
              className="max-w-full max-h-[400px] rounded-md shadow-md"
            />
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Removebackground