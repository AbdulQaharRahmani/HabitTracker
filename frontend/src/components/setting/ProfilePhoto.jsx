import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProfilePhotoStore } from "../../store/useProfilePhotoStore";
import useAuthStore from "../../store/useAuthStore";

function ProfilePhoto() {
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const { userProfileUrl, fetchProfilePhoto, uploadProfilePhoto, loading } =
    useProfilePhotoStore();

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (!userId) return;
    fetchProfilePhoto(userId);
  }, [fetchProfilePhoto, userId]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    await uploadProfilePhoto(file, userId);

    setPreview(null);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-md dark:border-gray-800 bg-orange-100 dark:bg-gray-800">
        <img
          src={loading && preview ? preview : userProfileUrl}
          alt="Profile"
          className="object-cover w-full h-full"
        />
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
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
