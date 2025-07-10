import { useState, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../App.jsx";
import { CheckCircle, AlertTriangle, Loader, Trophy, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LuckyDrawWinnerSection = ({ propertyId, isUserRegistered }) => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (propertyId) {
      fetchWinnerDetails();
    }
  }, [propertyId]);

  const fetchWinnerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Backendurl}/api/lucky-draw/property/${propertyId}/winner`);

      if (response.data.success) {
        setWinner(response.data.winner);
        setError(null);
      } else {
        setError(response.data.message || "Failed to load winner details.");
      }
    } catch (err) {
      console.error("Error fetching winner details:", err);
      setError("Unable to retrieve winner information at this time.");
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user is the winner
  const isCurrentUserWinner = () => {
    return winner && user && winner._id === user.id;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 flex justify-center items-center py-8">
        <Loader className="w-6 h-6 text-amber-500 animate-spin" />
        <span className="ml-3 text-gray-600">Loading winner information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-orange-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <p className="text-orange-800">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <h3 className="flex items-center gap-2 text-xl font-semibold text-amber-700 mb-3">
        <Trophy className="w-6 h-6 text-amber-500" /> 
        Lucky Draw Winner
      </h3>
      
      {winner ? (
        <div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{winner.name}</h4>
                <p className="text-sm text-gray-500">Winner</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">
              The lucky draw for this property has been completed and the winner has been selected.
            </p>
            
            {isCurrentUserWinner() ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold">Congratulations! You are the winner!</span>
                </div>
                <p className="mt-2 text-green-600">
                  Our team will contact you shortly at your registered phone number 
                  with details on how to proceed with this property.
                </p>
              </div>
            ) : isUserRegistered ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-700">
                  Thank you for participating! While you weren't selected this time, 
                  we have many more opportunities coming soon.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bg-orange-100 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-orange-800 font-medium">
              Winner has not been selected yet.
            </p>
          </div>
          <p className="mt-2 text-orange-700 text-sm">
            Winner selection will happen after the registration period ends. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default LuckyDrawWinnerSection;