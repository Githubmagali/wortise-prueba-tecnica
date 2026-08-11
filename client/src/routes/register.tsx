import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button, Card, Input, Label, TextField, FieldError } from '@heroui/react'
import { registerFormSchema } from '@/lib/schemas'
import { signUp } from '@/lib/auth-client'

export const Route = createFileRoute('/register')({
    component: RegisterPage,
})

function RegisterPage() {
    const navigate = useNavigate()
    const [formError, setFormError] = useState<string | null>(null)

    const form = useForm({
        defaultValues: { name: '', email: '', password: '' },
        onSubmit: async ({ value }) => {
            setFormError(null)
            const { error } = await signUp.email({
                name: value.name,
                email: value.email,
                password: value.password,
            })
            if (error) {
                setFormError(error.message || 'No se pudo completar el registro.')
                return
            }
            navigate({ to: '/', search: { q: '', page: 1 } })
        },
    })

    return (
        <div className="flex justify-center p-8">
            <Card className="w-full max-w-sm">
                <div className="flex flex-col gap-1.5 pb-0">
                    <h2 className="">Crear cuenta</h2>
                    <p className="text-sm text-default-500">Registrate con tu email y contraseña.</p>
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
                            name="name"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = registerFormSchema.shape.name.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <div>
                                    <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                                        <Label>Nombre</Label>
                                        <Input
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <FieldError>{field.state.meta.errors.join(', ')}</FieldError>
                                        )}
                                    </TextField>
                                </div>
                            )}
                        </form.Field>
                        <form.Field
                            name="email"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = registerFormSchema.shape.email.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
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
                            name="password"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = registerFormSchema.shape.password.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                                    <Label>Contraseña</Label>
                                    <Input
                                        type="password"
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
                                <Button type="submit" isDisabled={!canSubmit} isPending={isSubmitting}>
                                    Crear cuenta
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>
                    <p className="text-sm text-default-500 mt-4 text-center">
                        ¿Ya tenés cuenta? <Link to="/login" className="underline">Ingresá</Link>
                    </p>
                </Card.Content>
            </Card>
        </div>
    )
}
