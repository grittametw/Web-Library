import Omise from "omise"

const omise = Omise({
    secretKey: process.env.OMISE_SECRET_KEY as string
})

export default omise