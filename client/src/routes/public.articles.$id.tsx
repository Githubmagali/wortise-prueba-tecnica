import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export const Route = createFileRoute('/public/articles/$id')({
  component: PublicArticleDetailPage,
})

function PublicArticleDetailPage() {
  const { id } = Route.useParams()
  const { data: session } = useSession()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-article', id],
    queryFn: () => api.getPublicArticle(id),
  })

  useDocumentTitle(data?.item.title ? `${data.item.title} · Artículos` : 'Artículos')
  if (isLoading) {
    return <p className="p-8 text-default-500">Cargando artículo...</p>
  }

  if (isError || !data) {
    return <p className="p-8 text-danger">No se pudo cargar el artículo.</p>
  }

  const article = data.item
 useDocumentTitle(`${article.title} · Artículos`)
  return (
  <div className="relative p-2 sm:p-8">
  <div className="flex flex-col gap-4 mb-6 lg:mb-0 lg:absolute lg:left-8 lg:top-8">
        {session?.user ? (
          <>
            <Link
              to="/"
              search={{ q: '', page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
               <div className="icon-embed-custom-8 w-embed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 22 20"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  role="img"
                  className="scale-x-[-1]"
                >
                  <path d="M7.04379 1.99763L12.2366 6.16251C12.9933 6.76943 12.5196 7.86052 11.4861 7.8913L2.469 8.16516C1.15631 8.20502 0.128831 9.1541 0.175149 10.284C0.220789 11.4144 1.32343 12.2988 2.63753 12.2589L11.6533 11.9851C12.6867 11.9531 13.2478 13.0134 12.5434 13.6641L7.70457 18.1336C9.62728 19.6757 12.6389 19.5849 14.4312 17.9293L20.2296 12.5734C22.0213 10.9185 21.9157 8.3263 19.9923 6.7836L13.7697 1.79275C11.847 0.250637 8.83538 0.341496 7.04306 1.99705L7.04379 1.99763Z" fill="currentColor" />
                </svg>
              </div> Volver a la búsqueda
            </Link>
            <Link
              to="/articles"
              search={{ page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
               <div className="icon-embed-custom-8 w-embed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 22 20"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  role="img"
                  className="scale-x-[-1]"
                >
                  <path d="M7.04379 1.99763L12.2366 6.16251C12.9933 6.76943 12.5196 7.86052 11.4861 7.8913L2.469 8.16516C1.15631 8.20502 0.128831 9.1541 0.175149 10.284C0.220789 11.4144 1.32343 12.2988 2.63753 12.2589L11.6533 11.9851C12.6867 11.9531 13.2478 13.0134 12.5434 13.6641L7.70457 18.1336C9.62728 19.6757 12.6389 19.5849 14.4312 17.9293L20.2296 12.5734C22.0213 10.9185 21.9157 8.3263 19.9923 6.7836L13.7697 1.79275C11.847 0.250637 8.83538 0.341496 7.04306 1.99705L7.04379 1.99763Z" fill="currentColor" />
                </svg>
              </div> Ver mis artículos
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/"
              search={{ q: '', page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
               <div className="icon-embed-custom-8 w-embed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 22 20"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  role="img"
                  className="scale-x-[-1]"
                >
                  <path d="M7.04379 1.99763L12.2366 6.16251C12.9933 6.76943 12.5196 7.86052 11.4861 7.8913L2.469 8.16516C1.15631 8.20502 0.128831 9.1541 0.175149 10.284C0.220789 11.4144 1.32343 12.2988 2.63753 12.2589L11.6533 11.9851C12.6867 11.9531 13.2478 13.0134 12.5434 13.6641L7.70457 18.1336C9.62728 19.6757 12.6389 19.5849 14.4312 17.9293L20.2296 12.5734C22.0213 10.9185 21.9157 8.3263 19.9923 6.7836L13.7697 1.79275C11.847 0.250637 8.83538 0.341496 7.04306 1.99705L7.04379 1.99763Z" fill="currentColor" />
                </svg>
              </div>  
             Volver a la búsqueda
            </Link>
            <Link
              to="/"
              search={{ q: article.authorName, page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
              <div className="icon-embed-custom-8 w-embed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 22 20"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  role="img"
                  className="scale-x-[-1]"
                >
                  <path d="M7.04379 1.99763L12.2366 6.16251C12.9933 6.76943 12.5196 7.86052 11.4861 7.8913L2.469 8.16516C1.15631 8.20502 0.128831 9.1541 0.175149 10.284C0.220789 11.4144 1.32343 12.2988 2.63753 12.2589L11.6533 11.9851C12.6867 11.9531 13.2478 13.0134 12.5434 13.6641L7.70457 18.1336C9.62728 19.6757 12.6389 19.5849 14.4312 17.9293L20.2296 12.5734C22.0213 10.9185 21.9157 8.3263 19.9923 6.7836L13.7697 1.79275C11.847 0.250637 8.83538 0.341496 7.04306 1.99705L7.04379 1.99763Z" fill="currentColor" />
                </svg>
              </div>    
              Ver más de {article.authorName}
            </Link>
          </>
        )}
      </div>

      <div className="container max-w-3xl flex flex-col gap-4 mx-auto">
        {article.coverImageUrl && (
          <img src={article.coverImageUrl} alt={article.coverImageUrl} className="w-full max-h-96 object-cover rounded-md" />
        )}
        <h1 className="font-semibold">{article.title}</h1>
        <p className="text-sm text-default-500">
          Por {article.authorName} · {new Date(article.createdAt).toLocaleDateString('es-AR')}
        </p>
        <p className="whitespace-pre-wrap leading-relaxed">{article.content}</p>
      </div>
    </div>
  )
}
