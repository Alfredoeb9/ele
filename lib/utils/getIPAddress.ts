export const getIPAddress = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();

  return data;
};
