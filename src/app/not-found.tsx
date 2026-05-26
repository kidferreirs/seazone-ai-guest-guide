export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Seazone AI Guest Guide
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          Imóvel não encontrado
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          O código informado não existe ou não está disponível no momento.
        </p>

        <a
          href="/FLN001"
          className="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          Ver demonstração
        </a>
      </div>
    </main>
  )
}