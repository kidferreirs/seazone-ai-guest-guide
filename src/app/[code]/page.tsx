import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ExperienceGuide } from "@/components/guide/ExperienceGuide"
import { AssistantChat } from "@/components/chat/AssistantChat"

interface Props {
  params: Promise<{
    code: string
  }>
}

export default async function PropertyPage({ params }: Props) {
  const { code } = await params

  const property = await prisma.property.findUnique({
    where: {
      code: code.toUpperCase(),
    },
  })

  if (!property) {
    notFound()
  }

  const data = property.data as any

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative h-[400px] w-full">
        <Image
          src={data.images[0]}
          alt={data.name}
          fill
          priority
          loading="eager"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-10 left-10 z-10">
          <p className="text-sm uppercase tracking-widest text-zinc-300">
            {data.address.city} • {data.address.state}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {data.name}
          </h1>

          <p className="mt-3 text-zinc-200">
            {data.property_type} • {data.guest_capacity} hóspedes
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Informações do imóvel
            </h2>

            <div className="space-y-2 text-zinc-300">
              <p>
                🛏️ Quartos: {data.bedroom_quantity}
              </p>

              <p>
                🚿 Banheiros: {data.bathroom_quantity}
              </p>

              <p>
                👥 Capacidade: {data.guest_capacity}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              WiFi
            </h2>

            <div className="space-y-2 text-zinc-300">
              <p>
                📶 Rede: {data.operational.wifi_network}
              </p>

              <p>
                🔐 Senha: {data.operational.wifi_password}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Check-in
            </h2>

            <div className="space-y-2 text-zinc-300">
              <p>
                ⏰ Check-in: {data.rules.check_in_time}
              </p>

              <p>
                ⏰ Check-out: {data.rules.check_out_time}
              </p>

              <p>
                🚪 {data.operational.property_access_instructions}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Anfitrião
            </h2>

            <div className="space-y-2 text-zinc-300">
              <p>
                👤 {data.host.name}
              </p>

              <p>
                📱 {data.host.phone}
              </p>
            </div>
          </div>

        </div>
      </section>
      <ExperienceGuide propertyCode={data.code} />
      <AssistantChat propertyCode={data.code} />
    </main>
  )
}