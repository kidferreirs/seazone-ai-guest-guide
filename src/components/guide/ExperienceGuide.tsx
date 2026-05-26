"use client"

import { useState } from "react"

type GuideItem = {
  name: string
  distance: string
  description: string
  type?: string
}

type Guide = {
  welcome_message: string
  restaurants: GuideItem[]
  attractions: GuideItem[]
  essentials: GuideItem[]
  seasonal_tip: string
}

interface Props {
  propertyCode: string
}

export function ExperienceGuide({ propertyCode }: Props) {
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generateGuide() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: propertyCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar guia")
      }

      setGuide(data.guide)
      setSource(data.source)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível gerar o guia agora."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cyan-300">
              Guia de Experiências com IA
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Recomendações personalizadas para sua estadia
            </h2>

            <p className="mt-2 max-w-2xl text-zinc-400">
              Restaurantes, atrações, serviços essenciais e dicas sazonais
              geradas com base na localização real deste imóvel.
            </p>
          </div>

          <button
            onClick={generateGuide}
            disabled={loading}
            className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Gerando guia..." : "Gerar guia com IA"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-cyan-100">
            A IA está criando recomendações contextualizadas para este imóvel.
            Isso pode levar alguns segundos...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {guide && (
          <div className="mt-8 space-y-8">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-lg text-zinc-100">
                {guide.welcome_message}
              </p>

              {source && (
                <p className="mt-3 text-xs uppercase tracking-widest text-zinc-500">
                  Fonte: {source === "cache" ? "guia salvo no banco" : "gerado por IA"}
                </p>
              )}
            </div>

            <GuideSection title="Restaurantes próximos" items={guide.restaurants} />
            <GuideSection title="Atrações próximas" items={guide.attractions} />
            <GuideSection title="Serviços essenciais" items={guide.essentials} />

            <div className="rounded-2xl bg-amber-500/10 p-5 text-amber-100">
              <h3 className="mb-2 text-xl font-semibold">
                Dica sazonal
              </h3>
              <p>{guide.seasonal_tip}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function GuideSection({
  title,
  items,
}: {
  title: string
  items: GuideItem[]
}) {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-semibold">
        {title}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={`${title}-${item.name}`}
            className="rounded-2xl bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-semibold text-zinc-100">
                {item.name}
              </h4>

              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                {item.distance}
              </span>
            </div>

            {item.type && (
              <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">
                {item.type}
              </p>
            )}

            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}