import { NextResponse } from "next/server"
import omise from "@/lib/omise"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const charge = await omise.charges.retrieve(params.id)

    return NextResponse.json({
      id: charge.id,
      status: charge.status,
      paid: charge.paid,
      amount: charge.amount,
      currency: charge.currency,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }
}