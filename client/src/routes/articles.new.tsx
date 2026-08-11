import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, Card, Input, TextField, Label, FieldError } from '@heroui/react'
import { articleFormSchema } from '@/lib/schemas'
import { api, ApiError } from '@/lib/api'

export const Route = createFileRoute('/articles/new')({
    component: NewArticlePage,
})

function NewArticlePage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [formError, setFormError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: (input: { title: string; content: string; coverImageUrl?: string }) =>
            api.createArticle(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-articles'] })
            navigate({ to: '/articles/$id', params: { id: data.item.id } })
        },
        onError: (error) => {
            setFormError(error instanceof ApiError ? error.message : 'No se pudo crear el artículo.')
        },
    })

    const form = useForm({
        defaultValues: { title: '', content: '', coverImageUrl: '' },
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
            <Link
                to="/articles"
                search={{ page: 1 }}
                className="text-sm text-default-500 underline w-fit flex items-center gap-2 p-5 link"
            >
                <div className="button-icon-wrap-49 is-left" data-astro-cid-6vk3rcnz="">
                    <div className="button-text-27-icon w-embed" data-astro-cid-6vk3rcnz="">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className="rotate-180" data-astro-cid-6vk3rcnz="">
                            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" fill="currentColor" data-astro-cid-6vk3rcnz=""></path>
                        </svg>
                    </div>
                    <div className="button-icon-bg-27" data-astro-cid-6vk3rcnz=""></div>
                </div>
                Volver
            </Link>
            <div className="sm:p-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <div className="flex flex-col gap-1 p-1">
                        <h1 className="text-2xl font-bold">Nuevo artículo</h1>
                        <p className="text-default-500 text-sm">Completá los datos y guardá.</p>
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
                                    <Button type="submit" isDisabled={!canSubmit} isPending={isSubmitting || mutation.isPending}>
                                        Crear artículo
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