import os from "os";

export const getIPv4Address = () => {
  const networkInterfaces = os.networkInterfaces();
  const arr = networkInterfaces["Wi-Fi"];
  const ip = arr?.find((wifiNetworkConf) => wifiNetworkConf.family === "IPv4");

  return ip?.address || "127.0.0.1";
};
