import AstralObject from "./astralObject"
import { validate, getEndpoint } from "./utils"
import axios from "axios"

/**
 * Represents the different colors of Soloons in the Megaverse
 */
enum SoloonColor {
    red = "red",
    blue = "blue",
    purple = "purple",
    white = "white",
}

/**
 * Represents a Soloon in the Megaverse
 */
export default class Soloon extends AstralObject {
    #color: SoloonColor

    constructor(row: number, column: number, color: string) {
        validate(
            Object.values(SoloonColor).includes(color as SoloonColor),
            `Invalid Soloon color ${color}`,
        )
        super(row, column)
        this.#color = color as SoloonColor
    }

    async save(): Promise<boolean> {
        const saveUrl = getEndpoint(`/api/soloons`)
        const res = await axios.post(saveUrl, {
            candidateId: process.env.CANDIDATE_ID,
            row: this.row,
            column: this.column,
            color: this.#color.toString(),
        })

        return res.status === 200
    }
}
