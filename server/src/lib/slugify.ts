export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes 
    .replace(/[^a-z0-9\s-]/g, "") // saca signos de puntuación 
    .trim()
    .replace(/\s+/g, "-") // Dibuja los - espacios 
    .replace(/-+/g, "-"); // colapsa guiones repetidos
}