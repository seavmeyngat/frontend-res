import React, { useEffect, useState } from "react";
import API from "../APIs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    name: "",
    type: "food",
    price: "",
    discount: "",
    description: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/items/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      type: "food",
      price: "",
      discount: "",
      description: "",
    });
    setImage(null);
    setEditingItem(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    let imageUrl = null;
    if (image) {
      const imgForm = new FormData();
      imgForm.append("image", image);
      try {
        const uploadRes = await API.post("/upload", imgForm, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        imageUrl = uploadRes.data.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return toast.error("Image upload failed");
      }
    }

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      discount: parseFloat(form.discount) || 0,
      image_url: imageUrl,
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingItem) {
        const res = await API.put(
          `/items/updateBy/${editingItem.id}`,
          payload,
          config
        );
        setItems((prev) =>
          prev.map((item) => (item.id === res.data.id ? res.data : item))
        );
        toast.success("Item updated successfully");
      } else {
        const res = await API.post("/items/create", payload, config);
        setItems((prev) => [...prev, res.data]);
        toast.success("Item created successfully");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving item:", err.response || err.message);
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/items/deleteBy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      type: item.type,
      price: item.price,
      discount: item.discount,
      description: item.description,
    });
    setImage(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="main-container bg-white p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Items</h1>

      <form
        onSubmit={handleCreateOrUpdate}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded"
      >
        <div>
          <label className="block text-black mb-1">Name</label>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="p-2 border rounded text-black w-full"
          />
        </div>
        <div>
          <label className="block text-black mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="p-2 border rounded text-black w-full"
          >
            <option value="food">Food</option>
            <option value="drink">Drink</option>
            <option value="bakeries">Bakeries</option>
          </select>
        </div>
        <div>
          <label className="block text-black mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="p-2 border rounded text-black w-full"
          />
        </div>
        <div>
          <label className="block text-black mb-1">Discount (%)</label>
          <input
            type="number"
            step="1"
            placeholder="Discount"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="p-2 border rounded text-black w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-black mb-1">Description</label>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded text-black w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-black mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 border rounded text-black w-full"
          />
        </div>

        <div className="flex gap-4 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-16 py-2 rounded"
          >
            {editingItem ? "Update Item" : "Create Item"}
          </button>
          {editingItem && (
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
      {/* Filter & Search Section */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 justify-between">
        <input
          type="text"
          placeholder="Enter item name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded mb-2 md:mb-0 flex text-black md:w-1/3"
        />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded text-black px-8"
        >
          <option value="all">All Items</option>
          <option value="food">Foods</option>
          <option value="drink">Drinks</option>
          <option value="bakeries">Bakeries</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border text-left">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Discount (%)</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-black">
                    No items found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border text-black">
                      <div className="flex justify-center items-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-30 h-16 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 border text-black">{item.name}</td>
                    <td className="p-2 border text-black capitalize">
                      {item.type}
                    </td>
                    <td className="p-2 border text-black">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="p-2 border text-black">
                      {Number(item.discount)}%
                    </td>
                    <td className="p-2 border text-black">
                      {item.description}
                    </td>
                    <td className="p-2 border text-black">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(filteredItems.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Items;
