import { render, screen, act } from '@testing-library/react'
import { RichTextField } from '@/components/editor/richtext/RichTextField'
import { RichToolbar } from '@/components/editor/richtext/RichToolbar'
import { getRichExtensions } from '@/components/editor/richtext/tiptapSetup'

describe('getRichExtensions', () => {
  it('restituisce il set completo senza duplicati di nome', () => {
    const exts = getRichExtensions()
    const names = exts.map((e) => e.name)
    expect(new Set(names).size).toBe(names.length)
    for (const n of ['starterKit', 'textStyle', 'fontSize', 'color', 'highlight', 'textAlign']) {
      expect(names).toContain(n)
    }
    // Link e Underline arrivano dallo StarterKit v3 (niente duplicati)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const starterOptions = (exts.find((e) => e.name === 'starterKit') as any)?.options ?? {}
    expect(starterOptions.link).toBeDefined()
  })
})

describe('RichToolbar', () => {
  it('rende nulla senza editor', () => {
    const { container } = render(<RichToolbar editor={null} mode="block" />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('RichTextField', () => {
  it('monta editor + toolbar senza crash e mostra il contenuto', async () => {
    const onChange = jest.fn()
    render(<RichTextField id="t1" label="Titolo" value="Ciao mondo" multiline onChange={onChange} />)

    // Contenuto iniziale renderizzato da Tiptap
    expect(await screen.findByText('Ciao mondo')).toBeInTheDocument()

    // Toolbar completa: marks, size, link, align, block
    expect(screen.getByTitle('Grassetto (⌘B)')).toBeInTheDocument()
    expect(screen.getByTitle('Aumenta dimensione')).toBeInTheDocument()
    expect(screen.getByTitle('Colore testo')).toBeInTheDocument()
    expect(screen.getByTitle('Aggiungi link')).toBeInTheDocument()
    expect(screen.getByTitle('Centra')).toBeInTheDocument()
    expect(screen.getByTitle('Elenco puntato')).toBeInTheDocument()
    expect(screen.getByTitle('Titolo medio')).toBeInTheDocument()
    expect(screen.getByTitle('Rimuovi formattazione')).toBeInTheDocument()
  })

  it('in modalità inline non mostra controlli blocco', async () => {
    render(<RichTextField id="t2" label="CTA" value="Clicca" onChange={jest.fn()} />)
    await screen.findByText('Clicca')
    expect(screen.queryByTitle('Elenco puntato')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Titolo medio')).not.toBeInTheDocument()
    expect(screen.getByTitle('Centra')).toBeInTheDocument()
  })

  it('non chiama onChange al mount (solo su modifica)', async () => {
    const onChange = jest.fn()
    render(<RichTextField id="t3" label="X" value="abc" onChange={onChange} />)
    await screen.findByText('abc')
    // flush di eventuali timer di autosave
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600))
    })
    expect(onChange).not.toHaveBeenCalled()
  })
})
