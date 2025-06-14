import Link from "next/link"
import { AuthButton } from "./AuthButton"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
        <div className="flex items-center space-x-2">
          <AuthButton />
        </div>
      </div>
    </header>
  )
} 