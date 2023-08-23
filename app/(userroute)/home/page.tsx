import { authOptions } from "@/app/api/admin/auth"
import { getServerSession} from "next-auth"
import styles from '@/app/page.module.css'


export default async function UserHome(){
const session = await getServerSession(authOptions)
console.log(session)

if(session?.user.role !== "USER")
return(
    <div>
        <p>You are not registered</p>
    </div>
)

if(session?.user.role == "USER")
    return(
        <div className={styles.main}>
            <div className={styles.card}>
            <h1>{session.user.name}</h1>
            <h1>{session.user.email}</h1>
            </div>
        </div>
    )
}