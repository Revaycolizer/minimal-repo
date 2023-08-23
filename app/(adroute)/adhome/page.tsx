import { authOptions } from "@/app/api/admin/auth"
import { getServerSession} from "next-auth"
import styles from '@/app/page.module.css'
import Cookies from "js-cookie"; 
import { getAdmin } from "@/app/actions/getAdminToken";

export default async function AdHome(){

const user = await getAdmin()
console.log(user)

// if(session?.user.role == "ADMIN")
    return(
        <div className={styles.main}>
            <div className={styles.card}>
            {/* <h1>{user.name}</h1>
            <h1>{user.email}</h1> */}
            </div>
        </div>
    )
}