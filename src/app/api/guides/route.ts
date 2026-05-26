import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/ai"
import { buildExperienceGuidePrompt } from "@/lib/prompts"
import { Property } from "@/types/property"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = String(body.code || "").toUpperCase()

    if (!code) {
      return NextResponse.json(
        { error: "Property code is required" },
        { status: 400 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { code },
      include: { guide: true },
    })

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }

    if (property.guide) {
      return NextResponse.json({
        source: "cache",
        guide: property.guide.content,
      })
    }

    const propertyData = property.data as unknown as Property

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Você gera guias locais úteis para hóspedes. Responda sempre somente com JSON válido.",
        },
        {
          role: "user",
          content: buildExperienceGuidePrompt(propertyData),
        },
      ],
      response_format: {
        type: "json_object",
      },
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error("Empty AI response")
    }

    const guideContent = JSON.parse(content)

    const guide = await prisma.guide.create({
      data: {
        propertyId: property.id,
        content: guideContent,
      },
    })

    return NextResponse.json({
      source: "ai",
      guide: guide.content,
    })
  } catch (error) {
    console.error("Guide generation error:", error)

    return NextResponse.json(
      {
        error: "Não foi possível gerar o guia agora. Tente novamente em instantes.",
      },
      { status: 500 }
    )
  }
}