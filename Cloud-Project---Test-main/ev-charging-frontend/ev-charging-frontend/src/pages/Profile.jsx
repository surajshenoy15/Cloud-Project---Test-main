import React, { useState, useEffect } from 'react';
import { FaMedal, FaBolt, FaHistory, FaGift } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const membershipBenefits = {
    Bronze: ['Earn 200 points per booking', 'Basic support'],
    Silver: ['Earn 250 points per booking', 'Priority support', '5% discount on bookings'],
    Gold: ['Earn 300 points per booking', 'Premium support', '10% discount on bookings', 'Free cancellation'],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile({
          name: response.data.name,
          email: response.data.email,
          rewardPoints: response.data.rewards.points,
          membershipLevel: response.data.rewards.level,
          totalBookings: response.data.rewards.total_bookings,
          rewardHistory: response.data.history.map(item => ({
            id: item.id,
            points: item.points,
            action: item.description,
            date: new Date(item.created_at).toLocaleDateString()
          }))
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Failed to load profile data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">{profile.name[0]}</span>
              </div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMedal className="text-yellow-500 text-xl" />
                <div>
                  <p className="font-semibold">{profile.membershipLevel}</p>
                  <p className="text-sm text-gray-600">Membership Level</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaBolt className="text-blue-500 text-xl" />
                <div>
                  <p className="font-semibold">{profile.rewardPoints} points</p>
                  <p className="text-sm text-gray-600">Reward Balance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaHistory className="text-green-500 text-xl" />
                <div>
                  <p className="font-semibold">{profile.totalBookings}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Membership Benefits</h3>
            <div className="space-y-4">
              {membershipBenefits[profile.membershipLevel].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FaGift className="text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Next Level Requirements:</h4>
              {profile.membershipLevel === 'Bronze' && (
                <p>Earn 1000 points to reach Silver</p>
              )}
              {profile.membershipLevel === 'Silver' && (
                <p>Earn 2500 points to reach Gold</p>
              )}
            </div>
          </div>

          {/* Reward History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Reward History</h3>
            <div className="space-y-4">
              {profile.rewardHistory.map((record) => (
                <div key={record.id} className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">+{record.points} points</span>
                    <span className="text-sm text-gray-600">{record.date}</span>
                  </div>
                  <p className="text-gray-600">{record.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;