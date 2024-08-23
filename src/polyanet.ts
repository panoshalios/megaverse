import AstralObject from "./astralObject"
import { getEndpoint } from "./utils"
import axios from "axios"

/**
 * Represents a Polyanet in the Megaverse
 */
export default class Polyanet extends AstralObject {
    constructor(row: number, column: number) {
        super(row, column)
    }

    async save(): Promise<boolean> {
        const saveUrl = getEndpoint(`/api/polyanets`)
        const body = {
            candidateId: process.env.CANDIDATE_ID,
            row: this.row,
            column: this.column,
        }
        const res = await axios.post(saveUrl, body)
        return res.status === 200
    }
}
