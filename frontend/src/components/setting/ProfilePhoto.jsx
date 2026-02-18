import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProfilePhotoStore } from "../../store/useProfilePhotoStore";
import useAuthStore from "../../store/useAuthStore";
import toast from 'react-hot-toast';

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
      toast.error(t("image_invalid_file"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try{
      await uploadProfilePhoto(file, userId);
      toast.success(t("profile_photo_updated"));
    }catch(error){
      console.log(error);
      toast.error(t("profile_photo_update_failed"));
    }finally{
      setPreview(null);
    }

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
        className="px-3 py-2 text-xs font-semibold transition-colors shadow-sm  bg-indigo-500 text-white rounded-md hover:bg-indigo-700  dark:hover:bg-indigo-800 dark:text-gray-300"
      >
        {t("CHANGE PHOTO")}
      </button>
    </div>
  );
}

export default ProfilePhoto;
