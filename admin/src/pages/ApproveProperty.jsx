import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiSearch, FiX, FiHash } from "react-icons/fi";  // Added search, clear, and hash icons
import { backendurl } from "../App";

const ApproveProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/properties/admin/approved`);
        setProperties(response.data.properties);
      } catch (err) {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const updateApproval = async (id, newStatus) => {
    try {
      await axios.put(`${backendurl}/api/properties/admin/approved/${id}`, { isApproved: newStatus });
      setProperties(prev =>
        prev.map(property =>
          property._id === id ? { ...property, isApproved: newStatus } : property
        )
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
      alert("Failed to update property status.");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.delete(`${backendurl}/api/properties/admin/approved/${id}`);
      setProperties(prev => prev.filter(property => property._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete the property.");
    }
  };

  // Filter properties based on approval status and search query
  const filteredProperties = properties.filter(property => {
    // First filter by approval status
    const statusMatch = filter === "all" || 
      (filter === "approved" ? property.isApproved : !property.isApproved);
    
    if (!searchQuery.trim()) return statusMatch;
    
    // Check if query is numeric (potential serial number)
    const isNumericSearch = !isNaN(searchQuery) && searchQuery.trim() !== '';
    
    // If searching by serial number and exact match found
    if (isNumericSearch && property.serialNumber !== undefined) {
      if (property.serialNumber.toString() === searchQuery.trim()) {
        return statusMatch;
      }
    }
    
    // General text search across various fields
    const searchLower = searchQuery.toLowerCase();
    return statusMatch && (
      (property.title && property.title.toLowerCase().includes(searchLower)) ||
      (property.location && property.location.toLowerCase().includes(searchLower)) ||
      (property.serialNumber !== undefined && property.serialNumber.toString().includes(searchQuery))
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Check if search is potentially for a serial number
  const isSerialSearch = !isNaN(searchQuery) && searchQuery.trim() !== '';

  if (loading) return <p className="text-center text-xl mt-6">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Property Approval</h2>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSerialSearch ? (
              <FiHash className="h-5 w-5 text-gray-400" />
            ) : (
              <FiSearch className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            placeholder="Search by name, location, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-700" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center">
          <label className="mr-3 text-lg font-medium">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-4 py-2 text-lg shadow-sm bg-white"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
      </div>

      {/* Serial Number Search Notification */}
      {isSerialSearch && filteredProperties.length > 0 && filteredProperties[0].serialNumber?.toString() === searchQuery.trim() && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
          <FiHash className="text-blue-500 mr-2" />
          <p className="text-blue-700">Showing exact match for Property #{searchQuery}</p>
        </div>
      )}

      {/* Responsive Table with Clickable Rows */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3 w-[10%]">ID</th>
              <th className="border p-3 w-[20%]">Title</th>
              <th className="border p-3 w-[20%]">Location</th>
              <th className="border p-3 w-[10%]">Status</th>
              <th className="border p-3 w-[20%]">Last Updated</th>
              <th className="border p-3 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map(property => (
              <tr
                key={property._id}
                className="border hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                <td className="p-3 text-center font-mono">
                  {property.serialNumber !== undefined ? (
                    <span className="flex items-center justify-center">
                      <FiHash className="text-gray-500 mr-1" />
                      {property.serialNumber}
                    </span>
                  ) : "N/A"}
                </td>
                <td className="p-3">{property.title}</td>
                <td className="p-3">{property.location}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-white ${property.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {property.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="p-3 text-center">{property.createdAt ? formatDate(property.createdAt) : "N/A"}</td>
                <td className="p-3 text-center space-x-2">
                  {property.isApproved ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApproval(property._id, false);
                      }}
                    >
                      Disapprove
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApproval(property._id, true);
                      }}
                    >
                      Approve
                    </button>
                  )}

                  {/* Delete Icon with Animation */}
                  <button
                    className="bg-gray-700 hover:bg-gray-900 text-white p-2 rounded-full transition-transform transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProperty(property._id);
                    }}
                  >
                    <FiTrash2 size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Card Layout */}
      <div className="md:hidden">
        {filteredProperties.map(property => (
          <div
            key={property._id}
            className="mb-4 p-4 border border-gray-300 rounded shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/property/${property._id}`)}
          >
            {property.serialNumber !== undefined && (
              <div className="flex items-center mb-1 text-gray-500 font-mono">
                <FiHash size={14} className="mr-1" />
                <span>ID: {property.serialNumber}</span>
              </div>
            )}
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-sm text-gray-500">Last Updated: {property.updatedAt ? formatDate(property.updatedAt) : "N/A"}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-white ${property.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {property.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
            <div className="mt-4 flex justify-between">
              {property.isApproved ? (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateApproval(property._id, false);
                  }}
                >
                  Disapprove
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateApproval(property._id, true);
                  }}
                >
                  Approve
                </button>
              )}
              <button
                className="bg-gray-700 hover:bg-gray-900 text-white p-2 rounded-full transition-transform transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProperty(property._id);
                }}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 
              `No properties match "${searchQuery}" with the current filters` : 
              "No properties match the current filters"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApproveProperty;