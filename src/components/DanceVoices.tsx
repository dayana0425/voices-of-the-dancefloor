"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Music,
  Mic,
  Play,
  Pause,
  Upload,
  MapPin,
  Clock,
  Heart,
  Users,
  Calendar,
  ThumbsUp,
} from "lucide-react";

// Fix Leaflet icon issue in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

// Sample data structure with enhanced vibe data
const VENUES = [
  {
    id: 1,
    name: "Dynamic Bachata",
    day: "Monday",
    time: "7:30 PM - 10:00 PM",
    style: ["Bachata"],
    address: "Denver, CO",
    lat: 39.7392,
    lng: -104.9903,
    color: "bg-purple-500",
    vibe: {
      energy: "Intimate & Passionate",
      atmosphere: "Cozy studio with warm lighting",
      playlist: "Romantic Bachata Classics",
      photo:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      video:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    },
    voices: [
      {
        id: 1,
        authorName: "Maria Rodriguez",
        authorTitle: "Dance Instructor",
        timestamp: "Jan 15, 2025",
        caption: "This is where I found my dance family",
        duration: "0:32",
        thumbsUp: 24,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        vibe: "Warm & Welcoming",
        journalPrompt: "What makes you feel at home?",
      },
      {
        id: 2,
        authorName: "David Chen",
        authorTitle: "Community Member",
        timestamp: "Jan 10, 2025",
        caption: "Luis is an incredible teacher",
        duration: "0:28",
        thumbsUp: 18,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        vibe: "Inspiring & Supportive",
        journalPrompt: "Who has taught you something beautiful?",
      },
    ],
  },
  {
    id: 2,
    name: "Black Belt Salsa",
    day: "Tuesday",
    time: "8:00 PM - 11:00 PM",
    style: ["Salsa"],
    address: "Denver, CO",
    lat: 39.7294,
    lng: -104.9872,
    color: "bg-red-500",
    voices: [
      {
        id: 3,
        authorName: "Carlos Martinez",
        authorTitle: "DJ & Producer",
        timestamp: "Jan 12, 2025",
        caption: "Where I learned to lead with confidence",
        duration: "0:25",
        thumbsUp: 31,
      },
    ],
  },
  {
    id: 8,
    name: "Blue Ice Dance",
    day: "Tuesday",
    time: "9:00 PM - 12:00 AM",
    style: ["Bachata"],
    address: "Denver, CO",
    lat: 39.745,
    lng: -104.97,
    color: "bg-cyan-500",
    voices: [
      {
        id: 11,
        authorName: "Isabella Torres",
        authorTitle: "Venue Owner",
        timestamp: "Jan 16, 2025",
        caption: "Best bachata social after class on Tuesdays",
        duration: "0:29",
        thumbsUp: 42,
      },
      {
        id: 12,
        authorName: "Marco Silva",
        authorTitle: "DJ",
        timestamp: "Jan 14, 2025",
        caption: "The energy here is pure bachata love",
        duration: "0:33",
        thumbsUp: 27,
      },
    ],
  },
  {
    id: 9,
    name: "Bachata Denver",
    day: "Wednesday",
    time: "7:00 PM - 9:00 PM",
    style: ["Bachata"],
    address: "Denver, CO",
    lat: 39.738,
    lng: -104.985,
    color: "bg-indigo-500",
    voices: [
      {
        id: 13,
        authorName: "Luis Fernandez",
        authorTitle: "Lead Instructor",
        timestamp: "Jan 15, 2025",
        caption: "Come learn, then dance at Que Bueno after!",
        duration: "0:27",
        thumbsUp: 56,
      },
    ],
  },
  {
    id: 3,
    name: "Que Bueno Suerte",
    day: "Wednesday",
    time: "9:00 PM - 12:00 AM",
    style: ["Salsa", "Bachata"],
    address: "Denver, CO",
    lat: 39.7506,
    lng: -104.9954,
    color: "bg-yellow-500",
    voices: [
      {
        id: 4,
        authorName: "Ana Gutierrez",
        authorTitle: "Community Member",
        timestamp: "Jan 8, 2025",
        caption:
          "Best Wednesday night in Denver - everyone goes here after class",
        duration: "0:30",
        thumbsUp: 38,
      },
      {
        id: 14,
        authorName: "Roberto Diaz",
        authorTitle: "DJ",
        timestamp: "Jan 13, 2025",
        caption: "The social energy after Bachata Denver class is unreal",
        duration: "0:31",
        thumbsUp: 29,
      },
    ],
  },
  {
    id: 4,
    name: "Avalon Ballroom",
    day: "Thursday",
    time: "8:30 PM - 12:00 AM",
    style: ["Salsa", "Bachata", "Cumbia"],
    address: "Boulder, CO",
    lat: 40.015,
    lng: -105.2705,
    color: "bg-blue-500",
    voices: [
      {
        id: 5,
        authorName: "Miguel Santos",
        authorTitle: "Instructor",
        timestamp: "Jan 14, 2025",
        caption: "The energy here is unmatched",
        duration: "0:35",
        thumbsUp: 45,
      },
      {
        id: 6,
        authorName: "Sofia Ramirez",
        authorTitle: "Community Member",
        timestamp: "Jan 11, 2025",
        caption: "Thursday nights are sacred",
        duration: "0:22",
        thumbsUp: 33,
      },
    ],
  },
  {
    id: 5,
    name: "Cheesman Park Social",
    day: "Friday",
    time: "7:00 PM - 9:00 PM",
    style: ["All styles"],
    address: "Cheesman Park, Denver",
    lat: 39.7323,
    lng: -104.96,
    color: "bg-green-500",
    voices: [
      {
        id: 7,
        authorName: "Lucia Morales",
        authorTitle: "Community Organizer",
        timestamp: "Jan 13, 2025",
        caption: "Dancing under the stars ✨",
        duration: "0:28",
        thumbsUp: 67,
      },
    ],
  },
  {
    id: 6,
    name: "The Turnverine",
    day: "Saturday",
    time: "9:00 PM - 1:00 AM",
    style: ["Salsa", "Bachata"],
    address: "Denver, CO",
    lat: 39.76,
    lng: -104.9822,
    color: "bg-pink-500",
    voices: [
      {
        id: 8,
        authorName: "Rico Valenzuela",
        authorTitle: "DJ",
        timestamp: "Jan 9, 2025",
        caption: "Saturday night fever!",
        duration: "0:30",
        thumbsUp: 52,
      },
    ],
  },
  {
    id: 7,
    name: "La Rumba",
    day: "Sunday",
    time: "6:00 PM - 10:00 PM",
    style: ["Salsa", "Bachata", "Cumbia"],
    address: "Denver, CO",
    lat: 39.7192,
    lng: -104.9847,
    color: "bg-orange-500",
    voices: [
      {
        id: 9,
        authorName: "Isabella Martinez",
        authorTitle: "Venue Owner",
        timestamp: "Jan 7, 2025",
        caption: "Perfect way to end the week",
        duration: "0:33",
        thumbsUp: 41,
      },
      {
        id: 10,
        authorName: "Javier Lopez",
        authorTitle: "Community Member",
        timestamp: "Jan 5, 2025",
        caption: "Family vibes every Sunday",
        duration: "0:27",
        thumbsUp: 36,
      },
    ],
  },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// CountUp component for animated numbers
const CountUp = ({ from = 0, to, duration = 2, delay = 0 }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, to, duration, delay]);

  return <motion.span>{rounded}</motion.span>;
};

export default function VoicesOfTheDanceFloor() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'map'
  const [hoveredVenue, setHoveredVenue] = useState(null);
  const [likedVoices, setLikedVoices] = useState(new Set());
  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [catchVibeMode, setCatchVibeMode] = useState(false);
  const [selectedVibeVoice, setSelectedVibeVoice] = useState(null);

  // Center of Denver for the map
  const denverCenter: [number, number] = [39.7392, -104.9903];

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    // Don't auto-navigate to map, just update the selection
  };

  const handleThumbsUp = (voiceId, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedVoices);
    if (newLiked.has(voiceId)) {
      newLiked.delete(voiceId);
    } else {
      newLiked.add(voiceId);
    }
    setLikedVoices(newLiked);
  };

  const getVoiceThumbsUpCount = (voice) => {
    return voice.thumbsUp + (likedVoices.has(voice.id) ? 1 : 0);
  };

  const getSortedVoices = (voices) => {
    return [...voices].sort((a, b) => {
      const aCount = getVoiceThumbsUpCount(a);
      const bCount = getVoiceThumbsUpCount(b);
      return bCount - aCount;
    });
  };

  const getVenuesByDay = (day) => {
    return VENUES.filter((v) => v.day === day);
  };

  const getAllVoices = () => {
    return VENUES.flatMap((venue) => venue.voices);
  };

  const handlePlayVoice = (voiceId) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // In real app, would play actual audio
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  const handleCatchVibe = (voice) => {
    setSelectedVibeVoice(voice);
    setCatchVibeMode(true);
  };

  // Catch a Vibe Modal
  if (catchVibeMode && selectedVibeVoice) {
    const venue = VENUES.find((v) => v.voices.includes(selectedVibeVoice));
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => setCatchVibeMode(false)}
            className="text-white mb-6 hover:underline flex items-center gap-2"
            whileHover={{ x: -5 }}
          >
            ← Back to Stories
          </motion.button>

          <motion.div
            className="bg-white rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Vibe Header */}
            <div
              className={`${venue.color} p-8 text-white relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">🎵 Catch the Vibe</h1>
                <p className="text-white/90 text-lg">
                  {venue.name} • {selectedVibeVoice.vibe}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Voice & Media */}
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="space-y-6">
                  {/* Voice Player */}
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {selectedVibeVoice.authorName[0]}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {selectedVibeVoice.authorName}
                        </h3>
                        <p className="text-purple-600 text-sm font-semibold">
                          {selectedVibeVoice.authorTitle}
                        </p>
                      </div>
                    </div>

                    <motion.div
                      className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-gray-700 italic text-lg">
                        "{selectedVibeVoice.caption}"
                      </p>
                    </motion.div>

                    {/* Audio Player */}
                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayVoice(selectedVibeVoice.id)}
                      >
                        {playingVoice === selectedVibeVoice.id ? (
                          <Pause size={24} />
                        ) : (
                          <Play size={24} />
                        )}
                      </motion.button>
                      <div className="flex-grow">
                        <div className="text-sm text-gray-600 mb-1">
                          Voice Story
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-pink-500 h-2 rounded-full"
                            animate={{
                              width:
                                playingVoice === selectedVibeVoice.id
                                  ? "60%"
                                  : "0%",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedVibeVoice.duration}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Media Gallery */}
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4">
                      📸 Vibe Gallery
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="relative overflow-hidden rounded-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={venue.vibe.photo}
                          alt="Venue atmosphere"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            Atmosphere
                          </span>
                        </div>
                      </motion.div>
                      <motion.div
                        className="relative overflow-hidden rounded-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={venue.vibe.video}
                          alt="Dance moment"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            Dance Vibes
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right: Journal & Vibe Info */}
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="space-y-6">
                  {/* Journal Prompt */}
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4">
                      ✍️ Journal Prompt
                    </h4>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 mb-4">
                      <p className="text-gray-700 text-lg font-medium">
                        {selectedVibeVoice.journalPrompt}
                      </p>
                    </div>
                    <textarea
                      className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Share your thoughts..."
                    />
                    <motion.button
                      className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Reflection
                    </motion.button>
                  </motion.div>

                  {/* Vibe Details */}
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4">
                      🎭 Vibe Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className="text-gray-700">
                          <strong>Energy:</strong> {venue.vibe.energy}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-gray-700">
                          <strong>Atmosphere:</strong> {venue.vibe.atmosphere}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700">
                          <strong>Playlist:</strong> {venue.vibe.playlist}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex gap-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      Visit Venue
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Share Vibe
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (showRecorder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowRecorder(false)}
            className="text-white mb-6 hover:underline"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Story 🎤
            </h2>
            <p className="text-gray-600 mb-6 italic">
              Every voice adds to the tapestry. Help newcomers find their place
              in the rhythm.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Which venue do you want to share about?
                </label>
                <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none">
                  <option>Select a venue...</option>
                  {VENUES.map((v) => (
                    <option key={v.id}>
                      {v.name} ({v.day}s)
                    </option>
                  ))}
                  <option>+ Add a new Denver venue</option>
                </select>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-xl border-2 border-dashed border-pink-300">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                      isRecording ? "bg-red-500 animate-pulse" : "bg-pink-500"
                    }`}
                  >
                    <Mic className="text-white" size={40} />
                  </div>
                  <p className="text-gray-700 mb-4 font-medium">
                    {isRecording ? "Recording... 0:15" : "Ready to record"}
                  </p>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-8 py-3 rounded-full font-bold text-white transition-all ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                  <p className="text-sm text-gray-600 mt-3">
                    30-60 seconds max
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell newcomers about this spot
                </label>
                <input
                  type="text"
                  placeholder="What makes this place special? What should first-timers know?"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add photos (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">1-3 photos</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your role in the community
                </label>
                <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none">
                  <option>Select your role...</option>
                  <option>DJ</option>
                  <option>Instructor</option>
                  <option>Venue Owner</option>
                  <option>Community Member</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your full name
                </label>
                <input
                  type="text"
                  placeholder="Maria Rodriguez"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg">
                Share with the Denver Dance Community ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVenue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedVenue(null)}
            className="text-white mb-6 hover:underline"
          >
            ← Back to Calendar
          </button>

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className={`${selectedVenue.color} p-8 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {selectedVenue.name}
                  </h1>
                  <div className="space-y-1 text-white/90">
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>
                        {selectedVenue.day}s • {selectedVenue.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{selectedVenue.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Music size={18} />
                      <span>{selectedVenue.style.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {selectedVenue.voices.length}
                  </div>
                  <div className="text-sm">voices</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  What the Community Says
                </h2>
                <button
                  onClick={() => setShowRecorder(true)}
                  className="flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors"
                >
                  <Mic size={18} />
                  Add Your Story
                </button>
              </div>

              <div className="space-y-4">
                {getSortedVoices(selectedVenue.voices).map((voice) => (
                  <div
                    key={voice.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {voice.authorName[0]}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {voice.authorName}
                          </span>
                          <span className="text-gray-500 text-sm">
                            • {voice.timestamp}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                          {voice.authorTitle}
                        </div>
                        <p className="text-gray-700 italic mb-3">
                          "{voice.caption}"
                        </p>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handlePlayVoice(voice.id)}
                            className={`flex items-center gap-2 ${
                              playingVoice === voice.id
                                ? "bg-pink-500 text-white"
                                : "bg-white text-pink-500 border border-pink-500"
                            } px-4 py-2 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all`}
                          >
                            {playingVoice === voice.id ? (
                              <>
                                <Pause size={16} />
                                Playing...
                              </>
                            ) : (
                              <>
                                <Play size={16} />
                                Play {voice.duration}
                              </>
                            )}
                          </button>

                          <button
                            onClick={(e) => handleThumbsUp(voice.id, e)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                              likedVoices.has(voice.id)
                                ? "bg-purple-500 text-white"
                                : "bg-white text-purple-500 border border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            <ThumbsUp size={16} />
                            {getVoiceThumbsUpCount(voice)}
                          </button>

                          {playingVoice === voice.id && (
                            <div className="flex-grow h-2 bg-pink-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-pink-500 rounded-full animate-pulse"
                                style={{ width: "40%" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      {/* Hero Section */}
      <div className="text-center py-12 px-6">
        <div className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
          Denver's Latin Dance Community
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Voices of the Dance Floor 💃🕺
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-2 italic">
          Every dancer has a home. Every venue tells a story.
        </p>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Hear from the DJs, instructors, and dancers who bring Denver's salsa,
          bachata, and cumbia scene to life. Find your rhythm, find your people.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowRecorder(true)}
            className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-lg inline-flex items-center gap-3"
          >
            <Mic size={24} />
            Share Your Story
          </button>
        </div>
      </div>

      {/* Top Stories Section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            🎵 Catch the Vibe
          </motion.h2>
          <motion.p
            className="text-white/80 text-lg mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Listen to the voices that capture the soul of Denver's dance scene
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Mic size={16} />
            <span>Voice recordings • Photos • Videos • Journal prompts</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getSortedVoices(getAllVoices())
            .slice(0, 6)
            .map((voice, index) => {
              const venue = VENUES.find((v) => v.voices.includes(voice));
              return (
                <motion.div
                  key={voice.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setSelectedVenue(venue)}
                    whileHover={{
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      borderColor: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {voice.authorName[0]}
                        </motion.div>
                        <div className="flex-grow">
                          <motion.div
                            className="flex items-center gap-2 mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            <span className="font-bold text-white text-sm">
                              {voice.authorName}
                            </span>
                            <span className="text-white/60 text-xs">
                              • {voice.timestamp}
                            </span>
                          </motion.div>
                          <motion.div
                            className="text-xs font-semibold text-pink-300 mb-3 uppercase tracking-wide"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.3 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            {voice.authorTitle}
                          </motion.div>
                          <motion.p
                            className="text-white/90 text-sm italic mb-4 line-clamp-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.4 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            "{voice.caption}"
                          </motion.p>

                          {/* Voice Recording Controls */}
                          <motion.div
                            className="flex items-center gap-3 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.5 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            <motion.button
                              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                                playingVoice === voice.id
                                  ? "bg-pink-500 text-white"
                                  : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayVoice(voice.id);
                              }}
                            >
                              {playingVoice === voice.id ? (
                                <>
                                  <Pause size={16} />
                                  Playing...
                                </>
                              ) : (
                                <>
                                  <Play size={16} />
                                  Play {voice.duration}
                                </>
                              )}
                            </motion.button>
                          </motion.div>

                          <motion.div
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.6 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="flex items-center gap-2">
                              <motion.div
                                className={`${venue.color} px-3 py-1 rounded-full text-xs text-white font-semibold shadow-md`}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {venue.name}
                              </motion.div>
                              <div className="text-white/60 text-xs">
                                {venue.day}s
                              </div>
                            </div>
                            <motion.div
                              className="flex items-center gap-1 text-pink-300"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ThumbsUp size={16} />
                              <span className="text-sm font-semibold">
                                <CountUp
                                  to={getVoiceThumbsUpCount(voice)}
                                  duration={1}
                                  delay={0.7 + index * 0.1}
                                />
                              </span>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex gap-1">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              viewMode === "calendar"
                ? "bg-white text-pink-600 shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Calendar size={20} />
            Calendar
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              viewMode === "map"
                ? "bg-white text-pink-600 shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            <MapPin size={20} />
            Map
          </button>
        </div>
      </motion.div>

      {/* Map View with Leaflet */}
      {viewMode === "map" && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Map Description */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              🗺️ The Rhythm of Colorado
            </h2>
            <p className="text-white/90 text-lg max-w-4xl mx-auto italic">
              “They didn’t know how to talk to each other,
              so they communicated through movement.” Mapping silent conversations across Colorado — where human connection happens without words.

            </p>
            <p className="text-white/70 text-sm mt-4">
              Click any venue to discover the stories that make these places
              sacred
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Map Area with Leaflet */}
              <div className="lg:col-span-2 h-[600px]">
                <MapContainer
                  center={denverCenter}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {VENUES.map((venue) => {
                    // Create custom colored icon for each venue
                    const colorMap = {
                      "bg-purple-500": "#8b5cf6",
                      "bg-red-500": "#ef4444",
                      "bg-cyan-500": "#06b6d4",
                      "bg-indigo-500": "#6366f1",
                      "bg-yellow-500": "#eab308",
                      "bg-blue-500": "#3b82f6",
                      "bg-green-500": "#22c55e",
                      "bg-pink-500": "#ec4899",
                      "bg-orange-500": "#f97316",
                    };

                    const venueColor = colorMap[venue.color] || "#8b5cf6";

                    const customIcon = L.divIcon({
                      className: "custom-div-icon",
                      html: `<div style="
                        background-color: ${venueColor};
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "><div style="color: white; font-size: 12px; font-weight: bold;">${venue.name[0]}</div></div>`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12],
                    });

                    return (
                      <Marker
                        key={venue.id}
                        position={[venue.lat, venue.lng]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => setSelectedVenue(venue),
                          mouseover: () => setHoveredVenue(venue.id),
                          mouseout: () => setHoveredVenue(null),
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="font-bold text-gray-900 text-sm mb-1">
                              {venue.name}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {venue.day}s • {venue.time}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              {venue.style.join(", ")}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Users size={12} />
                              <span>{venue.voices.length} stories</span>
                            </div>
                            <button
                              onClick={() => setSelectedVenue(venue)}
                              className="mt-2 w-full bg-pink-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-pink-600"
                            >
                              View Stories
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              {/* Venue List Sidebar */}
              <div className="bg-gradient-to-b from-purple-50 to-pink-50 p-6 overflow-y-auto h-[600px]">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Denver Dance Spots
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Click any venue to hear community stories
                </p>
                <div className="space-y-3">
                  {VENUES.map((venue) => (
                    <div
                      key={venue.id}
                      className={`bg-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
                        hoveredVenue === venue.id
                          ? "border-pink-500 shadow-lg"
                          : "border-transparent"
                      }`}
                      onMouseEnter={() => setHoveredVenue(venue.id)}
                      onMouseLeave={() => setHoveredVenue(null)}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`${venue.color} w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0`}
                        >
                          <Music size={18} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-gray-900 text-sm">
                            {venue.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {venue.day}s
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Users size={12} />
                              <span>{venue.voices.length}</span>
                            </div>
                            <div className="text-xs text-gray-400">•</div>
                            <div className="text-xs text-gray-500">
                              {venue.style.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Calendar */}
      {viewMode === "calendar" && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Weekly Dance Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {DAYS.map((day) => {
                const venues = getVenuesByDay(day);

                return (
                  <div
                    key={day}
                    className="bg-white rounded-xl p-4 min-h-[200px]"
                  >
                    <h3 className="font-bold text-gray-900 mb-3 text-center border-b-2 border-gray-200 pb-2">
                      {day}
                    </h3>

                    {venues.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm mt-8">
                        No venues yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {venues.map((venue) => (
                          <div
                            key={venue.id}
                            onClick={() => setSelectedVenue(venue)}
                            className="cursor-pointer hover:scale-105 transition-transform"
                          >
                            <div
                              className={`${venue.color} text-white p-3 rounded-lg shadow-md`}
                            >
                              <div className="font-semibold text-sm mb-1">
                                {venue.name}
                              </div>
                              <div className="text-xs opacity-90 mb-2">
                                {venue.time}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs">
                                  <Users size={12} />
                                  <span>{venue.voices.length} voices</span>
                                </div>
                                <Heart size={14} className="opacity-75" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">
                <CountUp to={VENUES.length} duration={1.5} delay={0.2} />
              </div>
              <div className="text-white/80">Denver Venues</div>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">
                <CountUp
                  to={VENUES.reduce((sum, v) => sum + v.voices.length, 0)}
                  duration={2}
                  delay={0.4}
                />
              </div>
              <div className="text-white/80">Community Stories</div>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">
                <CountUp to={7} duration={1} delay={0.6} />
              </div>
              <div className="text-white/80">Nights a Week</div>
            </motion.div>
          </div>

          {/* New to Denver Interactive Selector */}
          <div className="mt-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-8 border-2 border-white/30">
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              New to the Denver Scene? 🌟
            </h3>
            <p className="text-white/90 text-center mb-6 max-w-2xl mx-auto">
              Tell us what day you're free, and we'll show you where to go.
            </p>

            <div className="max-w-4xl mx-auto">
              <p className="text-white font-semibold text-center mb-4">
                What day do you want to dance?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {DAYS.map((day) => {
                  const venuesForDay = VENUES.filter((v) => v.day === day);
                  const hasVenues = venuesForDay.length > 0;

                  return (
                    <button
                      key={day}
                      onClick={() => hasVenues && handleDaySelect(day)}
                      disabled={!hasVenues}
                      className={`p-4 rounded-xl font-bold transition-all ${
                        selectedDay === day
                          ? "bg-white text-purple-600 shadow-lg scale-105"
                          : hasVenues
                          ? "bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 hover:scale-105"
                          : "bg-white/10 text-white/40 border-2 border-white/20 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-lg">{day}</div>
                      {hasVenues && (
                        <div className="text-xs mt-1 opacity-80">
                          {venuesForDay.length} venue
                          {venuesForDay.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDay &&
                VENUES.filter((v) => v.day === selectedDay).length > 0 && (
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/30 animate-fadeIn">
                    <p className="text-white text-center mb-4">
                      <span className="font-bold text-xl">
                        On {selectedDay}s in Denver:
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {VENUES.filter((v) => v.day === selectedDay).map(
                        (venue) => (
                          <div
                            key={venue.id}
                            onClick={() => setSelectedVenue(venue)}
                            className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`${venue.color} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0`}
                              >
                                <Music size={20} />
                              </div>
                              <div className="flex-grow">
                                <div className="font-bold text-gray-900">
                                  {venue.name}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {venue.time}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="text-xs text-gray-500">
                                    {venue.style.join(", ")}
                                  </div>
                                  <div className="text-xs text-gray-400">•</div>
                                  <div className="text-xs text-gray-500">
                                    {venue.voices.length} stories
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
