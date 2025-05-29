"use client";

import { useEffect, useState } from "react";
import MenuCard from "../components/Menucard";
import Header from "../components/Header";


import API from "../APIs/axios";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("Food");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [weeklyMenuImages, setWeeklyMenuImages] = useState([]);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [weeklyError, setWeeklyError] = useState(null);

  const [zoomImage, setZoomImage] = useState(null);

  const categoryButtons = [
    { id: "food", name: "Food", icon: "🌭" },
    { id: "drink", name: "Drink", icon: "🥤" },
    { id: "bakery", name: "Bakery", icon: "🥖" },
  ];

  const categoryInfo = {
    Food: { icon: "🍕", type: "food" },
    Drink: { icon: "☕", type: "drink" },
    Bakery: { icon: "🥐", type: "bakery" },
  };

  // Format date string for display, e.g. "May 23, 2025"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d)
      ? dateStr
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  // Format Date object to yyyy-mm-dd string for API query params
  const formatYMD = (date) => date.toISOString().split("T")[0];

  // Fetch category items when activeCategory changes
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/items/getAll?type=${categoryInfo[activeCategory].type}`
        );
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeCategory]);

  // Fetch weekly menus for date range: today → 5 days from now
const fetchActiveWeeklyMenu = async () => {
  setWeeklyLoading(true);
  setWeeklyError(null);

  try {
    const today = new Date();
    const todayStr = formatYMD(today);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5); // look ahead 10 days
    const futureStr = formatYMD(futureDate);

    // Request menus from today to +10 days ahead
    const response = await API.get(`/weekly_menu/range?from=${todayStr}&to=${futureStr}`);
    const weeklyMenus = response.data;

    const activeMenus = weeklyMenus.filter(menu => {
      const from = new Date(menu.from_date);
      const to = new Date(menu.to_date);
      return from <= today && to >= today;
    });

    if (activeMenus.length > 0) {
      setWeeklyMenuImages(activeMenus);
    } else {
      setWeeklyMenuImages([]);
      setWeeklyError("No currently active weekly menus.");
    }
  } catch (error) {
    console.error("Failed to load weekly menus:", error);
    setWeeklyError("Failed to load weekly menus. Please try again later.");
    setWeeklyMenuImages([]);
  } finally {
    setWeeklyLoading(false);
  }
};

  useEffect(() => {
    fetchActiveWeeklyMenu();
  }, []);


  return (
    <div className="min-h-screen bg-white text-black font-robotoSerif">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl lg:text-4xl text-green-700 font-bold text-center mt-5">
          Weekly Special Menu
        </h1>

        {weeklyLoading ? (
          <p className="text-center mt-6">Loading weekly menu...</p>
        ) : weeklyError ? (
          <p className="text-center mt-6 text-red-500">{weeklyError}</p>
        ) : weeklyMenuImages.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">
            No weekly menu images found.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 mt-5">
            {weeklyMenuImages.map((menu) => {
              const imageUrl = Array.isArray(menu.images_urls)
                ? menu.images_urls[0] || ""
                : menu.images_urls || "";

              return (
                <div
                  key={menu.id}
                  className="w-full sm:w-[500px] md:w-[600px] lg:w-[640px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Weekly Menu"
                      className="w-full h-[400px] object-cover rounded-xl border border-gray-200 cursor-zoom-in"
                      onClick={() => setZoomImage(imageUrl)}
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}

                  <div className="mt-6 w-full text-left space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block rounded-full font-medium uppercase tracking-wide
    px-4 py-1 text-sm sm:text-base
    ${
      ["lunch", "breakfast"].includes(
        menu.menu_shift?.toLowerCase()
      )
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800"
    }`}
                      >
                        {menu.menu_shift}
                      </span>

                      <span className="text-gray-500 text-sm">
                        {formatDate(menu.from_date)} ➝ {formatDate(menu.to_date)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium text-[16px] mt-5">
                      {menu.english_menu_description}
                    </p>
                    <p className="text-gray-700 text-[16px]">
                      {menu.khmer_menu_description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {zoomImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Zoomed Menu"
              className="max-w-[100%] max-h-[100%] rounded-xl shadow-2xl"
            />
          </div>
        )}

        <h1 className="text-2xl lg:text-4xl text-green-700 font-bold text-center mt-16">
          Our Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-4 max-w-7xl mx-auto mt-6 mb-8">
          {categoryButtons.map((category) => (
            <button
              key={category.id}
              className={`group relative overflow-hidden flex items-center justify-start gap-4 px-6 py-4 border rounded-2xl transition-colors duration-300 text-lg w-full z-10 category-button 
                ${
                  activeCategory === category.name
                    ? "border-green-500 bg-green-700 text-white"
                    : "border-green-600 text-green-700 hover:bg-green-100"
                }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white group-hover:bg-green-100 transition-colors duration-300">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1161/1161695.png"
                  alt="icon"
                  className="w-6 h-6"
                />
              </span>
              <span
                className={`relative z-10 text-xl font-semibold tracking-wide transition-colors duration-300 ${
                  activeCategory === category.name
                    ? "text-white"
                    : "text-green-700"
                }`}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>

        <section className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <span>{categoryInfo[activeCategory].icon}</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold">
                {activeCategory}
              </h2>
            </div>

            {loading ? (
              <p className="text-center mt-10">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-10 justify-items-center">
                {items.map((item) => (
                  <MenuCard
                    key={item.id}
                    image={item.image_url}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    discount={item.discount}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      
    </div>
  );
};

export default MenuPage;
