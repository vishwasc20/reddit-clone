export const capitalizeFirstLetter = (s: String): String => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
