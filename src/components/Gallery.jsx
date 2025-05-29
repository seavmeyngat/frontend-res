import React, { useEffect, useState } from 'react';
import API from '../APIs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Gallery() {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Draft',
    alt_text: '',
    tags: '',
    order: '',
  });
  const [editingImage, setEditingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const imagesPerPage = 8;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/galleries/getAll', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setFormData({
      title: '',
      description: '',
      status: 'Draft',
      alt_text: '',
      tags: '',
      order: '',
    });
    setEditingImage(null);
  };

  const handleUploadOrUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      return toast.error('Title is required.');
    }

    const token = localStorage.getItem('token');

    try {
      let imageUrl = editingImage?.image_url;

      // If a new image is selected
      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append('image', imageFile);

        const uploadRes = await API.post('/upload', uploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        imageUrl = uploadRes.data.url;
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        published_at: formData.status === 'Publish' ? new Date() : null,
      };

      if (editingImage) {
        const res = await API.put(
          `/galleries/update/${editingImage.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImages((prev) =>
          prev.map((img) => (img.id === res.data.id ? res.data : img))
        );
        toast.success('Gallery updated successfully');
      } else {
        const res = await API.post('/galleries/create', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages((prev) => [res.data, ...prev]);
        toast.success('Gallery created successfully');
      }

      resetForm();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/galleries/deleteBy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setStatusLoadingId(id);
    try {
      const token = localStorage.getItem('token');
      const imgToUpdate = images.find((img) => img.id === id);
      if (!imgToUpdate) return;

      const updatedData = {
        ...imgToUpdate,
        status: newStatus,
        published_at: newStatus === 'Publish' ? new Date() : null,
      };

      const res = await API.put(`/galleries/update/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages((prev) =>
        prev.map((img) => (img.id === id ? res.data : img))
      );

      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const paginatedImages = images.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  return (
    <div className="main-container bg-white p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Gallery</h1>

      {/* Form: Create or Edit */}
      <form
  onSubmit={handleUploadOrUpdate}
  className="mb-6 bg-gray-100 p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4"
>
  <div className="flex flex-col">
    <label htmlFor="imageUpload" className="mb-1 text-gray-700 font-medium">
      Upload Image
    </label>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={(e) => setImageFile(e.target.files[0])}
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="title" className="mb-1 text-gray-700 font-medium">
      Title
    </label>
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Title"
      value={formData.title}
      onChange={handleChange}
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="order" className="mb-1 text-gray-700 font-medium">
      Display Order
    </label>
    <input
      id="order"
      name="order"
      type="number"
      placeholder="Display Order"
      value={formData.order}
      onChange={handleChange}
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="status" className="mb-1 text-gray-700 font-medium">
      Status
    </label>
    <select
      id="status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      className="p-2 border rounded text-black"
    >
      <option value="Draft">Draft</option>
      <option value="Publish">Publish</option>
    </select>
  </div>

  <div className="flex flex-col">
    <label htmlFor="alt_text" className="mb-1 text-gray-700 font-medium">
      Alt Text
    </label>
    <input
      id="alt_text"
      name="alt_text"
      type="text"
      placeholder="Alt Text"
      value={formData.alt_text}
      onChange={handleChange}
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="tags" className="mb-1 text-gray-700 font-medium">
      Tags (comma separated)
    </label>
    <input
      id="tags"
      name="tags"
      type="text"
      placeholder="Tags (comma separated)"
      value={formData.tags}
      onChange={handleChange}
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col md:col-span-2">
    <label htmlFor="description" className="mb-1 text-gray-700 font-medium">
      Description
    </label>
    <textarea
      id="description"
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className="p-2 border rounded text-black w-full h-48 resize-y"
    />
  </div>

  <div className="flex items-center space-x-2 md:col-span-2">
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {editingImage ? 'Update Gallery' : 'Create Gallery'}
    </button>
    {editingImage && (
      <button
        type="button"
        onClick={resetForm}
        className="bg-gray-500 text-white px-16 py-2 rounded"
      >
        Cancel
      </button>
    )}
  </div>
</form>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-left">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Order</th>
                <th className="p-2 border">Alt Text</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedImages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-black">
                    No images found.
                  </td>
                </tr>
              ) : (
                paginatedImages.map((img) => (
                  <tr key={img.id}>
                    <td className="p-2 border text-black">
                      <img
                        src={img.image_url}
                        alt={img.alt_text || 'Gallery'}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="p-2 border text-black">{img.title}</td>
                    <td className="p-2 border text-black">
                      <select
                        value={img.status}
                        onChange={(e) =>
                          handleStatusChange(img.id, e.target.value)
                        }
                        className="p-1 border rounded"
                        disabled={statusLoadingId === img.id}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Publish">Publish</option>
                      </select>
                    </td>
                    <td className="p-2 border text-black">{img.description}</td>
                    <td className="p-2 border text-black">{img.order}</td>
                    <td className="p-2 border text-black">{img.alt_text}</td>
                    <td className="p-2 border text-black">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingImage(img);
                            setFormData({
                              title: img.title,
                              description: img.description,
                              status: img.status,
                              alt_text: img.alt_text,
                              tags: img.tags,
                              order: img.order,
                            });
                            setImageFile(null);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(images.length / imagesPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Gallery;
