import { NextResponse } from "next/server"
import Omise from "omise"

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY as string,
  publicKey: process.env.OMISE_PUBLIC_KEY as string,
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { amount } = body

        const source = await omise.sources.create({
            type: "promptpay",
            amount: amount * 100,
            currency: "thb",
        })

        const charge = await omise.charges.create({
            amount: amount * 100,
            currency: "thb",
            source: source.id,
        })

        return NextResponse.json({
            success: true,
            chargeId: charge.id,
            qr: charge.source?.scannable_code?.image?.download_uri ?? null,
            status: charge.status,
        })

    } catch (error: unknown) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}