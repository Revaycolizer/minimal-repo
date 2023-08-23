// hooks/useUserData.ts
import Cookies from "js-cookie";

export function getStoredUserData() {
  return new Promise<{ name: string; email: string }>((resolve) => {
    const storedUserData = Cookies.get("userToken");
    const parsedUserData = JSON.parse(storedUserData || "{}");
    resolve(parsedUserData);
  });
}
