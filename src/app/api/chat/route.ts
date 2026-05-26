import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { message, propertyCode } = await req.json()

    if (!message || !propertyCode) {
      return new Response("Invalid request", {
        status: 400,
      })
    }

    const property = await prisma.property.findUnique({
      where: {
        code: propertyCode.toUpperCase(),
      },

      include: {
        guide: true,
      },
    })

    if (!property) {
      return new Response("Property not found", {
        status: 404,
      })
    }

    const propertyData = property.data as any
    const guideData = property.guide?.content as any

    const systemPrompt = `
Você é um assistente virtual da Seazone.

Você ajuda hóspedes durante a estadia.

REGRAS IMPORTANTES:
- Responda SOMENTE com base nas informações fornecidas.
- Nunca invente informações.
- Seja educado, objetivo e útil.
- Responda em português brasileiro.
- Se não souber uma informação, diga claramente que ela não está disponível.

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
    console.error(error)

    return new Response("Internal Server Error", {
      status: 500,
    })
  }
}