import { revalidatePath } from 'next/cache'

/**
 * Purge any cached render of the public pages after admin content changes.
 * Public pages that read stored content are already rendered dynamically,
 * so this is a belt-and-braces measure; it never throws.
 */
export function revalidatePublicPages(): void {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('[revalidate] Failed to revalidate public pages:', error)
  }
}
