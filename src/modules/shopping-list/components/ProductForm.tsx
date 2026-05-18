import { useState, type FormEvent } from 'react'

type ProductFormProps = {
  onSubmit: (name: string) => void
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return

    onSubmit(name)
    setName('')
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ej: Pan"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button className="button" type="submit">
        Agregar
      </button>
    </form>
  )
}
