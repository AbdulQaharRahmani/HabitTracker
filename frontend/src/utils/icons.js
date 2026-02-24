import {
  FaBriefcase,
  FaBuilding,
  FaLaptop,
  FaClipboardList,
  FaHome,
  FaBroom,
  FaCouch,
  FaShoppingCart,
  FaStore,
  FaHeartbeat,
  FaDumbbell,
  FaPlane,
  FaMap,
  FaFilm,
  FaGamepad,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";

export const iconCategories = {
  work: [
    { label: "Briefcase", value: "briefcase", icon: FaBriefcase },
    { label: "Office", value: "building", icon: FaBuilding },
    { label: "Laptop", value: "laptop", icon: FaLaptop },
    { label: "Tasks", value: "tasks", icon: FaClipboardList },
  ],

  home: [
    { label: "Home", value: "home", icon: FaHome },
    { label: "Cleaning", value: "cleaning", icon: FaBroom },
    { label: "Living Room", value: "couch", icon: FaCouch },
  ],

  shopping: [
    { label: "Cart", value: "cart", icon: FaShoppingCart },
    { label: "Store", value: "store", icon: FaStore },
  ],

  health: [
    { label: "Heartbeat", value: "heartbeat", icon: FaHeartbeat },
    { label: "Workout", value: "workout", icon: FaDumbbell },
  ],

  travel: [
    { label: "Plane", value: "plane", icon: FaPlane },
    { label: "Map", value: "map", icon: FaMap },
  ],

  entertainment: [
    { label: "Movie", value: "movie", icon: FaFilm },
    { label: "Gaming", value: "gaming", icon: FaGamepad },
  ],

  education: [
    { label: "Book", value: "book", icon: FaBook },
    { label: "Graduate", value: "graduate", icon: FaGraduationCap },
  ],
};