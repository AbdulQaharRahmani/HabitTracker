import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfilePhotoStore } from '../../store/useProfilePhotoStore';

function ProfilePhoto() {
    const fileInputref = useRef(null);
  const { t } = useTranslation();

  const { userProfileUrl, fetchProfilePhoto, uploadProfilePhoto, loading } = useProfilePhotoStore();

  const userId = "696f11b31ab597ee7ce63a0b";

  useEffect(() => {
    fetchProfilePhoto(userId);
  }, [fetchProfilePhoto, userId]);

  const handleButtonClick = () => {
    fileInputref.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    useProfilePhotoStore.setState({userProfileUrl:previewUrl});
    uploadProfilePhoto(file,userId);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-md dark:border-gray-800 bg-orange-100 dark:bg-gray-800">
        <img
          src={userProfileUrl}
          alt="Profile"
          className="object-cover w-full h-full"
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
        disabled={loading}
        className="px-4 py-2 text-xs font-semibold transition-colors border shadow-sm border-slate-200 rounded-lg hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
      >
        {t("CHANGE PHOTO")}
      </button>
    </div>
  );
}

export default ProfilePhoto;
