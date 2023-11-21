import { createContext } from "react"
import { User } from "@/_auth/AuthLayout"

export const UserContext = createContext<User | undefined>(undefined)