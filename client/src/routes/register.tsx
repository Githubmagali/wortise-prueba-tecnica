import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button, Card, Input, Label, TextField, FieldError } from '@heroui/react'
import { registerFormSchema } from '@/lib/schemas'
import { signUp } from '@/lib/auth-client'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export const Route = createFileRoute('/register')({
    component: RegisterPage,
})

function RegisterPage() {
    useDocumentTitle('Registrarme · Artículos')
    const navigate = useNavigate()
    const [formError, setFormError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

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
        <div className="flex justify-center p-2 sm:pt-28">
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
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="pr-10 input-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-default-500 button-4"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.16 4.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
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
