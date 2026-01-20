import React, { useRef, useState, useEffect, use } from 'react';
import api from '../../../services/api';
import { useTranslation } from 'react-i18next';

function ProfilePhoto() {
    const fileInputref = useRef(null);
    const {t}= useTranslation();
  const defaultAvatar = 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg';
    const [profileUrl, setProfileUrl] = useState(defaultAvatar);

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const fetchProfilePhoto = async () => {
    try {
      const response = await api.get('/users/696f11b31ab597ee7ce63a0b/profile-picture');

      if (response.data && response.data.success && response.data.data) {
        setProfileUrl(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputref.current.click();
  };

  const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await api.post('/users/profile-picture', formData);

      if (response.data && response.data.success) {
        setProfileUrl(response.data.data);
      } else {
        await fetchProfilePhoto();
      }
    } catch (error) {
      console.error('Error uploading:', error.response?.data || error.message);
      alert('Failed to upload image to server.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileUrl(previewUrl);
    uploadProfilePhoto(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-md dark:border-gray-800 bg-orange-100 dark:bg-gray-800">
        <img
          src={profileUrl}
          alt="Profile"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputref}
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        className="px-4 py-2 text-xs font-semibold transition-colors border shadow-sm border-slate-200 rounded-lg hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
      >
        {t("CHANGE PHOTO")}
      </button>
    </div>
  );
}

export default ProfilePhoto;
