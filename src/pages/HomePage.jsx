"use client";
import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Calendar } from "lucide-react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    description: "",
  });
  const [notification, setNotification] = useState(null);
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://pse-restaurant-be.final25.psewmad.org/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully:", formData);
        setFormData({ name: "", email: "", telephone: "", description: "" });
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Combined useEffect for fetching notification and config
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationRes, configRes] = await Promise.all([
          fetch("https://pse-restaurant-be.final25.psewmad.org/api/notifications/current"),
          fetch("https://pse-restaurant-be.final25.psewmad.org/api/restaurant_config/getAll"),
        ]);
        const notificationData = await notificationRes.json();
        const configData = await configRes.json();
        setNotification(notificationData);
        setConfig(configData);
        console.log("Notification:", notificationData);
        console.log("Restaurant config:", configData);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Enhanced loading state
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading...</p>
      </div>
    );

  return (

    <div className="font-robotoSerif min-h-screen text-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/backgroudhomepage.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      <div className="relative z-10">
        <Header />
        {config.length === 0 ? (
          <p className="text-center text-white/80">No restaurant information available.</p>
        ) : (
          config.map((restaurant) => (
            <main key={restaurant.id || restaurant.name} className="pt-20 pb-20">
              <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24 md:mt-14">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                      Crafting your <span className="text-green-400">Exceptional</span> Dining Experience
                    </h2>
                    <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                      {restaurant.description ||
                        "Lotus Blanc Training Restaurant and Bakery is a training restaurant that offers Asian and Western cuisine prepared and served by. Food and Beverage Service and Food Production students from the School of Hospitality.  With a two-year program , our students are able to apply the theory learned , in the restaurant and train in real -life conditions."}
                    </p>
                    <div className="pt-4 md:pt-6 flex flex-wrap gap-3 sm:gap-4">
                      <button className="bg-transparent border-2 border-white/30 hover:border-white text-white py-3 px-6 sm:py-5 sm:px-10 rounded-full font-medium flex items-center justify-center transition-all duration-300 hover:bg-white/10">
                        <Calendar className="w-5 h-5 mr-2" />
                        <Link to="/booking">Book Table</Link>
                      </button>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Village+Trea,+402+Ln,+12352"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="bg-green-600 hover:bg-green-700 text-white py-5 px-6 sm:py-5 sm:px-8 rounded-full font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-900/30">
                          <MapPin className="w-5 h-5 mr-2" />
                          Our Location
                        </button>
                      </a>
                    </div>
                  </div>

                  <div className="relative mt-20">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
                    <div className="relative bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-white/20 min-h-[400px] sm:min-h-[450px] flex flex-col justify-between shadow-xl shadow-green-900/20 overflow-hidden py-12 sm:py-20">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-green-500/10 rounded-full blur-xl"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-green-500/50 to-red-500/50"></div>

                      <h3 className="text-4xl font-bold text-center relative">
                        <span className="text-red-400 relative">
                          Reservations
                          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-red-400/30 rounded-full"></span>
                        </span>
                      </h3>

                      <div className="space-y-4 relative mt-10">
                        {notification && notification.notify_type === "closed" ? (
                          <div className="h-[380px] text-red-600 p-4 rounded-xl font-bold text-3xl shadow flex items-center justify-center text-center overflow-auto leading-relaxed">
                            {notification.description}
                          </div>
                        ) : (
                          <>
                            <div className="bg-black/30 p-4 sm:p-5 rounded-2xl border border-white/10 transform transition-transform hover:scale-[1.02] duration-300">
                              <h4 className="text-2xl font-semibold mb-3 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-green-400" />
                                Opening Hours
                              </h4>
                              <div className="pl-7 space-y-2">
                                <p className="text-white/90 text-lg">Monday to Friday</p>
                                <p className="text-red-300 flex items-center text-lg">
                                  <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                  {restaurant.opening_description || "Not available"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                              <div className="transform transition-all hover:translate-y-[-5px] duration-300">
                                <h5 className="text-xl font-semibold mb-2 flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center mr-2 text-green-400">
                                    <span className="text-sm">AM</span>
                                  </span>
                                  Breakfast
                                </h5>
                                <div className="py-3 px-4 rounded-xl bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-500/30 text-center font-medium shadow-inner shadow-black/20 text-[16px]">
                                  {restaurant.breakfast_from_time || "N/A"} am -{" "}
                                  {restaurant.breakfast_to_time || "N/A"} am
                                </div>
                              </div>
                              <div className="transform transition-all hover:translate-y-[-5px] duration-300">
                                <h5 className="text-xl font-semibold mb-2 flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center mr-2 text-green-400">
                                    <span className="text-sm">PM</span>
                                  </span>
                                  Lunch
                                </h5>
                                <div className="py-3 px-4 rounded-xl bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-500/30 text-center font-medium shadow-inner shadow-black/20 text-[16px]">
                                  {restaurant.lunch_from_time || "N/A"} pm -{" "}
                                  {restaurant.lunch_to_time || "N/A"} pm
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="relative mt-20">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black/50"></div>
                <svg
                  className="absolute top-0 left-0 w-full"
                  viewBox="0 0 1440 120"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 70C1248 80 1344 100 1392 110L1440 120V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V120Z"
                    fill="url(#paint0_linear)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="720"
                      y1="0"
                      x2="720"
                      y2="120"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="transparent" />
                      <stop offset="1" stopColor="rgba(0,0,0,0.3)" />
                    </linearGradient>
                  </defs>
                </svg>

                <section className="bg-gradient-to-b from-black/50 to-black/70 pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
                  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                      <h2 className="text-4xl font-bold">Get in Touch</h2>
                      <p className="text-xl text-white/80 leading-relaxed">
                        Have questions or want to make a reservation? Contact us directly or fill out the form.
                      </p>
                      <div className="space-y-4">
                        <a href={`tel:${restaurant.contact_phone_1 || "+85577777175"}`} className="flex items-center gap-4 group">
                          <div className="bg-green-600 group-hover:bg-green-700 p-4 rounded-full transition-colors">
                            <Phone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm text-white/70">Call Us</p>
                            <p className="font-medium text-lg">{restaurant.contact_phone_1 || "+85577777175"}</p>
                          </div>
                        </a>

                        <a href={`mailto:${restaurant.contact_email_1 || "booking@pse.ngo"}`} className="flex items-center gap-4 group">
                          <div className="bg-green-600 group-hover:bg-green-700 p-4 rounded-full transition-colors">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm text-white/70">Email Us</p>
                            <p className="font-medium text-lg">{restaurant.contact_email_1 || "booking@pse.ngo"}</p>
                          </div>
                        </a>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative space-y-6">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium text-white/80 block mb-1">
                          Your Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full p-3 sm:p-4 bg-white/5 border border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="text-sm font-medium text-white/80 block mb-1">
                          Your Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full p-3 sm:p-4 bg-white/5 border border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="telephone" className="text-sm font-medium text-white/80 block mb-1">
                          Telephone
                        </label>
                        <input
                          id="telephone"
                          name="telephone"
                          type="text"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          placeholder="+855..."
                          className="w-full p-3 sm:p-4 bg-white/5 border border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="text-sm font-medium text-white/80 block mb-1">
                          Message
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          required
                          placeholder="Your message..."
                          className="w-full p-3 sm:p-4 bg-white/5 border border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 py-3 px-6 sm:py-4 sm:px-8 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-900/30 w-full sm:w-auto"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </section>
              </div>

              <footer className="py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-18">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Lotus <span className="text-green-400">Blanc</span>
                  </h2>
                  <p className="text-white/60 text-lg sm:text-2xl">Training Restaurant & Bakery</p>
                  <p className="text-white/40 text-sm sm:text-lg break-words">
                    {restaurant.footer || "No footer information available."}
                  </p>
                </div>
              </footer>
            </main>
          ))
        )}
      </div>
    </div>
  );
}