export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .replace(/[^a-z0-9\s-]/g, '') // saca signos de puntuacion
    .trim()
    .replace(/\s+/g, '-') // para agregar guines
    .replace(/-+/g, '-') // colapsa guiones repetidos
}