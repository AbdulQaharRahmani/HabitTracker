import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MdOutlineWarningAmber,
  MdOutlineClose,

} from "react-icons/md";

export default function ConfirmationModal({
  type = "danger",
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  isLoading = false,
}) {
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);

  const variants = {
    danger: {
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700",
    },
    indigo: {
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      button: "bg-indigo-500 hover:bg-indigo-600",
    },

  };

  const icons = {
  danger: MdOutlineClose,
  indigo: MdOutlineWarningAmber
,
};

  const style = variants[type] || variants.danger;
  const IconComponent = icons[type] || MdOutlineWarningAmber;

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
    if (e.key === "Escape" && !isLoading) {
      onClose();
    }

    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // focus
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl px-6 py-10 z-10 text-center flex flex-col justify-center items-center gap-2">

        {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600
                      text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            <MdOutlineClose size={16} />
          </button>


        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3  justify-center">
          <div className={`${style.iconBg} p-3 rounded-full`}>
            <IconComponent size={32} className={style.iconColor} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ">
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
           {t("cancel")}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white transition disabled:opacity-50 flex items-center gap-2 ${style.button}`}
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
