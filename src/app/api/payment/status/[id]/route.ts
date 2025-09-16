import { NextResponse } from "next/server"
import omise from "@/lib/omise"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const charge = await omise.charges.retrieve(params.id)

    return NextResponse.json({
      id: charge.id,
      status: charge.status,
      paid: charge.paid,
      amount: charge.amount,
      currency: charge.currency,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}