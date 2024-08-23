import AstralObject from "./astralObject"
import { validate, getEndpoint } from "./utils"
import axios from "axios"

/**
 * Represents the different directions of Comeths in the Megaverse
 */
enum ComethDirection {
    left = "left",
    right = "right",
    up = "up",
    down = "down",
}

/**
 * Represents a Cometh in the Megaverse
 */
export default class Cometh extends AstralObject {
    #direction: ComethDirection

    constructor(row: number, column: number, direction: string) {
        validate(
            Object.values(ComethDirection).includes(
                direction as ComethDirection,
            ),
            `Invalid Cometh direction ${direction}`,
        )
        super(row, column)
        this.#direction = direction as ComethDirection
    }

    async save(): Promise<boolean> {
        const saveUrl = getEndpoint(`/api/comeths`)
        const res = await axios.post(saveUrl, {
            candidateId: process.env.CANDIDATE_ID,
            row: this.row,
            column: this.column,
            direction: this.#direction.toString(),
        })

        return res.status === 200
    }
}
