import React, { useState, useEffect, useRef } from "react";
import API from "../APIs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Weekly_Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [filterWeeklyByDate, setFilterWeeklyByDate] = useState("");
  const fileInputRef = useRef(null);

  const menusPerPage = 8;

  const [form, setForm] = useState({
    menu_shift: "breakfast",
    from_date: "",
    to_date: "",
    english_menu_description: "",
    khmer_menu_description: "",
  });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/weekly_menu/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(
        (res.data || []).sort(
          (a, b) => new Date(b.from_date) - new Date(a.from_date)
        )
      );
    } catch (err) {
      toast.error("Failed to fetch weekly menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const resetForm = () => {
    setForm({
      menu_shift: "breakfast",
      from_date: "",
      to_date: "",
      english_menu_description: "",
      khmer_menu_description: "",
    });
    setImageFiles([]);
    setEditingMenu(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.menu_shift || !form.from_date || !form.to_date) {
      return toast.error("Please fill in all required fields.");
    }

    if (new Date(form.from_date) > new Date(form.to_date)) {
      return toast.error("From Date cannot be after To Date.");
    }

    if (!editingMenu && imageFiles.length === 0) {
      return toast.error("Please select an image.");
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      let uploadedImageUrl = editingMenu?.images_urls || "";

      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", imageFiles[0]); // Only one image now

        const uploadRes = await API.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        uploadedImageUrl = uploadRes.data.url;
      }

      const payload = {
        ...form,
        images_urls: uploadedImageUrl,
      };

      let res;
      if (editingMenu) {
        res = await API.put(
          `/weekly_menu/updateBy/${editingMenu.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMenus((prev) =>
          prev.map((m) => (m.id === res.data.id ? res.data : m))
        );
        toast.success("Weekly menu updated successfully");
      } else {
        res = await API.post("/weekly_menu/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenus((prev) => [res.data, ...prev]);
        toast.success("Weekly menu created successfully");
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save weekly menu:", err);
      toast.error("Failed to save weekly menu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this weekly menu?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/weekly_menu/deleteBy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus((prev) => prev.filter((menu) => menu.id !== id));
      toast.success("Weekly menu deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setForm({
      menu_shift: menu.menu_shift,
      from_date: menu.from_date.slice(0, 10),
      to_date: menu.to_date.slice(0, 10),
      english_menu_description: menu.english_menu_description,
      khmer_menu_description: menu.khmer_menu_description,
    });
    setImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveUploadedImage = () => {
    if (editingMenu) {
      setEditingMenu({ ...editingMenu, images_urls: "" });
    }
  };

  const isFormDirty = () => {
    return (
      editingMenu ||
      form.from_date ||
      form.to_date ||
      form.english_menu_description ||
      form.khmer_menu_description ||
      imageFiles.length > 0
    );
  };

  const filteredMenus = filterWeeklyByDate
    ? menus.filter(
        (menu) =>
          new Date(menu.from_date).toISOString().slice(0, 10) ===
          filterWeeklyByDate
      )
    : menus;

  const paginatedMenus = filteredMenus.slice(
    (currentPage - 1) * menusPerPage,
    currentPage * menusPerPage
  );

  const ImageModal = ({ imageUrl, onClose }) => (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img
        src={imageUrl}
        alt="Full view"
        className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );

  return (
    <div className="main-container bg-white p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Weekly Menu</h1>

      <form
        onSubmit={handleCreateOrUpdate}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded"
      >
        <div className="flex flex-col">
          <label
            htmlFor="menu_shift"
            className="mb-1 text-gray-700 font-medium"
          >
            Menu Shift
          </label>
          <select
            id="menu_shift"
            name="menu_shift"
            value={form.menu_shift}
            onChange={handleInputChange}
            required
            className="p-2 border rounded text-black"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="fileInput" className="mb-1 text-gray-700 font-medium">
            Upload Image
          </label>
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded text-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="from_date" className="mb-1 text-gray-700 font-medium">
            From Date
          </label>
          <input
            type="date"
            id="from_date"
            name="from_date"
            value={form.from_date}
            onChange={handleInputChange}
            required
            className="p-2 border rounded text-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="to_date" className="mb-1 text-gray-700 font-medium">
            To Date
          </label>
          <input
            type="date"
            id="to_date"
            name="to_date"
            value={form.to_date}
            onChange={handleInputChange}
            required
            className="p-2 border rounded text-black"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label
            htmlFor="english_menu_description"
            className="mb-1 text-gray-700 font-medium"
          >
            English Description
          </label>
          <textarea
            id="english_menu_description"
            name="english_menu_description"
            placeholder="English Description"
            value={form.english_menu_description}
            onChange={handleInputChange}
            required
            className="p-2 border rounded text-black"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label
            htmlFor="khmer_menu_description"
            className="mb-1 text-gray-700 font-medium"
          >
            Khmer Description
          </label>
          <textarea
            id="khmer_menu_description"
            name="khmer_menu_description"
            placeholder="Khmer Description"
            value={form.khmer_menu_description}
            onChange={handleInputChange}
            required
            className="p-2 border rounded text-black"
          />
        </div>

        {imageFiles.length > 0 && (
          <div className="md:col-span-2 flex justify-center">
            <img
              src={URL.createObjectURL(imageFiles[0])}
              alt="Selected"
              className="w-150 h-100 object-cover rounded shadow-md"
            />
          </div>
        )}

        <div className="flex gap-4 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded ${
              submitting ? "bg-gray-400" : "bg-blue-500 text-white"
            }`}
          >
            {submitting
              ? "Saving..."
              : editingMenu
              ? "Update Weekly Menu"
              : "Create Weekly Menu"}
          </button>
          {isFormDirty() && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 justify-end">
  <div className="flex items-center space-x-4">
    <label className="text-black">Filter By Date</label>
    <input
      type="date"
      value={filterWeeklyByDate}
      onChange={(e) => setFilterWeeklyByDate(e.target.value)}
      className="p-2 border rounded text-black"
    />
    <button
      onClick={() => setFilterWeeklyByDate("")}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      All Weekly Menu
    </button>
  </div>
</div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border text-left">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Shift</th>
                <th className="p-2 border">From Date</th>
                <th className="p-2 border">To Date</th>
                <th className="p-2 border">English Description</th>
                <th className="p-2 border">Khmer Description</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMenus.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-black">
                    No weekly menus found.
                  </td>
                </tr>
              ) : (
                paginatedMenus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="p-2 border text-black">
                      {menu.images_urls ? (
                        <div className="relative">
                          <img
                            src={menu.images_urls}
                            alt="Menu"
                            className="w-24 h-16 object-cover rounded cursor-pointer"
                            onClick={() => setModalImage(menu.images_urls)}
                          />
                          {editingMenu?.id === menu.id && (
                            <button
                              onClick={handleRemoveUploadedImage}
                              className="absolute top-0 right-0 bg-black text-white text-sm px-1 rounded"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="p-2 border text-black capitalize">
                      {menu.menu_shift}
                    </td>
                    <td className="p-2 border text-black">
                      {new Date(menu.from_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border text-black">
                      {new Date(menu.to_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border text-black">
                      {menu.english_menu_description}
                    </td>
                    <td className="p-2 border text-black">
                      {menu.khmer_menu_description}
                    </td>
                    <td className="p-2 border text-black">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEdit(menu)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
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
              { length: Math.ceil(menus.length / menusPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {modalImage && (
        <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}

export default Weekly_Menu;
