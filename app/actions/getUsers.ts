import axios from 'axios'
import '../globals.css'


export async function getUsers() {
  try {
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/user`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch users");
  }
}
