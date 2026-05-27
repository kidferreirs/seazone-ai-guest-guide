import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

import { prisma } from "@/lib/prisma"
import { properties } from "@/data/properties"

export async function POST(req: Request) {
  try {
    const { message, propertyCode } = await req.json()

    if (!message || !propertyCode) {
      return new Response("Invalid request", {
        status: 400,
      })
    }

    const normalizedCode = String(propertyCode).toUpperCase()

    const property = await prisma.property
      .findUnique({
        where: {
          code: normalizedCode,
        },
        include: {
          guide: true,
        },
      })
      .catch(() => null)

    const fallbackProperty = properties.find(
      (item) => item.code === normalizedCode
    )

    if (!property && !fallbackProperty) {
      return new Response("Property not found", {
        status: 404,
      })
    }

    const propertyData = property?.data || fallbackProperty
    const guideData = property?.guide?.content || null

    const systemPrompt = `
Você é um assistente virtual da Seazone.

Você ajuda hóspedes durante a estadia.

REGRAS IMPORTANTES:
- Responda SOMENTE com base nas informações fornecidas.
- Nunca invente informações.
- Seja educado, objetivo e útil.
- Responda em português brasileiro.
- Se não souber uma informação, diga claramente que ela não está disponível.
- Para perguntas sobre WiFi, regras, check-in, check-out, estacionamento e acesso, use os dados do imóvel.
- Para perguntas sobre restaurantes, atrações e serviços próximos, use o guia de experiências quando disponível.
- Se o guia de experiências ainda não estiver disponível, diga que ele ainda não foi gerado e recomende gerar o guia na página.

DADOS DO IMÓVEL:
${JSON.stringify(propertyData, null, 2)}

GUIA DE EXPERIÊNCIAS:
${JSON.stringify(guideData, null, 2)}
`

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)

    return new Response("Internal Server Error", {
      status: 500,
    })
  }
}