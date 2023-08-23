import { getUsers } from "@/app/actions/getUsers"
import Users from "@/app/components/users/Users"
import styles from '@/app/page.module.css'
import toast from "react-hot-toast"

export default async function AdUser(){
const users = await getUsers()

    return(
        <div className={styles.main}>
            <div className={styles.card}>
            {users && users.map((user:any)=>(<Users key={user.name} user={user}/>))}
            </div>
        </div>
    )
}