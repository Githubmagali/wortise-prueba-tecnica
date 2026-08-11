import { Outlet, createRootRoute, Link, useNavigate } from '@tanstack/react-router'
import {  useSession, signOut } from '@/lib/auth-client'
import { Power } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate({ to: '/', search: { q: '', page: 1 } })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-default-200 px-4 sm:px-13 py-4 flex items-center justify-between">
        <Link to="/" search={{ q: '', page: 1 }} className="logo font-semibold text-lg">
          Artículos
        </Link>
        <div className="flex items-center gap-4">
          {!isPending && session?.user && (
            <>
             <span className="hidden sm:flex text-sm text-default-500">Hola, {session.user.name}</span>
              <Link to="/articles" search={{ page: 1 }} className="button-3">
                Mis artículos
              </Link>


              <button
                onClick={handleLogout}
                className="text-danger flex items-center gap-1.5 button-2"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <Power size={18} />
              </button>
            </>
          )}
          {!isPending && !session?.user && (
            <>
              <Link to="/login" className="underline">
                Ingresar
              </Link>
              <Link to="/register" className="underline">
                Registrarme
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="p-4 flex-1 justify-center">
        <Outlet />
      </main>
    </div>
  )
}