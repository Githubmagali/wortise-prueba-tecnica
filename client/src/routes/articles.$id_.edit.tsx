import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, Card, Input, TextField, Label, FieldError, Spinner } from '@heroui/react'
import { articleFormSchema } from '@/lib/schemas'
import { api, ApiError } from '@/lib/api'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export const Route = createFileRoute('/articles/$id_/edit')({
  component: EditArticlePage,
})

function EditArticlePage() {
  
  const { id } = Route.useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-article', id],
    queryFn: () => api.getMyArticle(id),
  })

  if (isLoading) {
    return (
     <div className="p-8 flex items-center gap-2 text-default-500">
          <Spinner size="sm" />
          <span>Cargando artículo...</span>
        </div>
    )
  }

  if (isError || !data) {
    return <p className="p-8 text-danger">No se pudo cargar el artículo.</p>
  }

  return <EditArticleForm id={id} article={data.item} />
  
}

function EditArticleForm({ id, article }: { id: string; article: { title: string; content: string; coverImageUrl: string | null } }) {
  useDocumentTitle(`Editar: ${article.title} · Artículos`)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (input: { title: string; content: string; coverImageUrl?: string }) =>
      api.updateArticle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
      queryClient.invalidateQueries({ queryKey: ['my-article', id] })
      navigate({ to: '/articles/$id', params: { id } })
    },
    onError: (error) => {
      setFormError(error instanceof ApiError ? error.message : 'No se pudo actualizar el artículo.')
    },
  })

  const form = useForm({
    defaultValues: {
      title: article.title,
      content: article.content,
      coverImageUrl: article.coverImageUrl || '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      mutation.mutate({
        title: value.title,
        content: value.content,
        coverImageUrl: value.coverImageUrl.trim() ? value.coverImageUrl.trim() : undefined,
      })
    },
  })

  return (
    <>
    <div className=" sm:p-8 flex justify-center">
          <div className="w-full max-w-2xl">
        <Link
          to="/articles/$id"
          params={{ id }}
          className="text-sm text-default-500 underline w-fit flex items-center gap-2 py-6 lg:py-0"
        >
          ← Volver al artículo
        </Link>
      </div>
      <Card className="w-full max-w-2xl">
         <div className="flex flex-col gap-1.5 pb-0">
          <h2 className="">Editar artículo</h2>
          <p className="text-sm text-default-500">Modificá los datos y guardá los cambios.</p>
        </div>
        <Card.Content>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) => {
                  const result = articleFormSchema.shape.title.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>Título</Label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors.join(', ')}</FieldError>
                  )}
                </TextField>
              )}
            </form.Field>

            <form.Field
              name="coverImageUrl"
              validators={{
                onChange: ({ value }) => {
                  const result = articleFormSchema.shape.coverImageUrl.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>URL de imagen de portada (opcional)</Label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://..."
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors.join(', ')}</FieldError>
                  )}
                </TextField>
              )}
            </form.Field>

            <form.Field
              name="content"
              validators={{
                onChange: ({ value }) => {
                  const result = articleFormSchema.shape.content.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>Contenido</Label>
                  <textarea
                    className="w-full min-h-48 rounded-md border border-default-200 p-3 text-sm outline-none focus:border-default-500"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors.join(', ')}</FieldError>
                  )}
                </TextField>
              )}
            </form.Field>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" 
                isDisabled={!canSubmit} isPending={isSubmitting || mutation.isPending}>
                  Guardar cambios
                </Button>
              )}
            </form.Subscribe>
          </form>
        </Card.Content>
      </Card>
    </div>
    </>
  )

}