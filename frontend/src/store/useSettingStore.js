import { create } from "zustand";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import i18n from "../utils/i18n";

const useSettingStore = create((set) => ({
  username: "",

  updateUsername: async (newUsername) => {
    try {
      await api.patch("/users/username", { username: newUsername });

      set({ username: newUsername });

      useAuthStore.getState().updateUserName(newUsername);

      toast.success("Username updated successfully");
      return true;
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Could not update username");
      return false;
    }
  },

  updatePassword: async (oldPassword, newPassword) => {
    try {
      await api.patch("/users/changePassword", {
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      toast.success(i18n.t("Password updated. please log in again"));
      useAuthStore.getState().logout();

      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message || i18n.t("Password update failed"),
      );
      return false;
    }
  },
}));

export default useSettingStore;
