export const createQueryParams = (object) => {
  return Object.keys(object)
    .map((key) => key + "=" + JSON.stringify(object[key]))
    .join("&");
};