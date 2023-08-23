import axios from 'axios'
import '../globals.css'


export async function getAdmin() {
  try {
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/cookie`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch token");
    throw error
  }
}
