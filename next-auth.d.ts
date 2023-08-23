import { UserRole, UserState } from '@prisma/client'
import type{User} from 'next-auth'
import 'next-auth/jwt'

type UserId = string  

declare module 'next-auth/jwt' {
    interface JWT{
        id: UserId
        role: UserRole 
        ustate: UserState
    }
}

declare module 'next-auth'{
    interface Session{
        user: User & {
            id: UserId
            role: UserRole
            ustate: UserState
        }
    }
}