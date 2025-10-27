// src/components/Sidebar.jsx
import {
  FaHome,
  FaHeart,
  FaBookmark,
  FaMapMarkerAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaPlus,
  FaClock,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

export function Sidebar({
  userProfile,
  pendingApprovals,
  onPost,
  onApprovals,
  onSignOut,
  onSettingsToggle,
  settingsOpen,
  signingOut,
}) {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col fixed left-0 top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900">Study Spot</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 group"
            >
              <FaHome className="w-5 h-5 group-hover:text-blue-700" />
              <span className="font-medium">Home</span>
            </a>
          </li>

          {/* Post Button - Only for Library Staff */}
          {userProfile?.role === "library_staff" && (
            <>
              <li>
                <button
                  onClick={onPost}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group w-full text-left"
                >
                  <FaPlus className="w-5 h-5 group-hover:text-green-500" />
                  <span>Post</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onApprovals}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group w-full text-left"
                >
                  <FaClock className="w-5 h-5 group-hover:text-orange-500" />
                  <span>Approvals</span>
                  {pendingApprovals.length > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {pendingApprovals.length}
                    </Badge>
                  )}
                </button>
              </li>
            </>
          )}

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group"
            >
              <FaHeart className="w-5 h-5 group-hover:text-red-500" />
              <span>Following</span>
            </a>
          </li>

          {/* Only show Saved for non-library staff */}
          {userProfile?.role !== "library_staff" && (
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group"
              >
                <FaBookmark className="w-5 h-5 group-hover:text-blue-500" />
                <span>Saved</span>
              </a>
            </li>
          )}

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group"
            >
              <FaMapMarkerAlt className="w-5 h-5 group-hover:text-green-500" />
              <span>Reserved</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group"
            >
              <FaUser className="w-5 h-5 group-hover:text-purple-500" />
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Settings Dropdown */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 settings-dropdown">
        <div className="relative">
          <button
            onClick={onSettingsToggle}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 group transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaCog className="w-5 h-5 group-hover:text-gray-700" />
              <span>Settings</span>
            </div>
            <FaChevronDown
              className={`w-4 h-4 transition-transform ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {settingsOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={onSignOut}
                disabled={signingOut}
                className={`flex items-center space-x-3 px-3 py-2 w-full text-left transition-colors group ${
                  signingOut
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <FaSignOutAlt
                  className={`w-4 h-4 ${
                    signingOut
                      ? "text-gray-400"
                      : "text-gray-500 group-hover:text-red-600"
                  }`}
                />
                <span className="text-sm">
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
