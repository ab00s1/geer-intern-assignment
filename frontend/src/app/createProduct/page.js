'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    tags: '',
    brand: '',
    imageUrls: [],
  })

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [previewImages, setPreviewImages] = useState([])
  const token = localStorage.getItem('token')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)
    setMessage('')

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)

        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })

        return res.data.cloudinaryUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }))

      setPreviewImages((prev) => [...prev, ...uploadedUrls])
    } catch (err) {
      console.error('Upload error:', err)
      setMessage('❌ Error uploading one or more images.')
    } finally {
      setUploading(false)
    }
  }

  const handleImageRemove = (urlToRemove) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
    }))
    setPreviewImages((prev) => prev.filter((url) => url !== urlToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const productData = {
      name: form.name,
      price: form.price,
      description: form.description,
      tags: form.tags,
      brand: form.brand,
      images: form.imageUrls,
    }

    try {
      await axios.post('http://localhost:5000/api/product/create', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage('✅ Product created successfully!')
      setForm({
        name: '',
        price: '',
        description: '',
        tags: '',
        brand: '',
        imageUrls: [],
      })
      setPreviewImages([])
      router.push('/')
    } catch (err) {
      console.log(err)
      setMessage('❌ Error creating product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Create New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Inputs */}
        {['name', 'price', 'brand', 'tags'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              type={field === 'price' ? 'number' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleInputChange}
              required={field === 'name' || field === 'price'}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={5}
            placeholder="Enter a detailed description..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />

          {previewImages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {previewImages.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(img)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 shadow hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
              loading || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Creating...'
              : uploading
              ? 'Uploading images...'
              : 'Create Product'}
          </button>

          {message && ( 
            <p
              className={`mt-3 text-center font-medium ${
                message.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default CreateProduct
