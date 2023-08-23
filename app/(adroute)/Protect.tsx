import '../globals.css'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/admin/auth"
import { redirect } from 'next/navigation'

export default  async function Protect({
    children,
  }: {
    children: React.ReactNode
  }){
    const session = await getServerSession(authOptions)

    if(session?.user.ustate == 'BLOCKED')
    return (
        <main><p>{session.user.name} is blocked</p></main>
        )

    if(session?.user.role == "USER"){
    redirect("/home")
    }
        
    if(session?.user.role == "ADMIN")
    return(
        <main>{children}</main>
    )
}