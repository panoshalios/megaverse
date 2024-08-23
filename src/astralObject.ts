import { validate, getEndpoint } from "./utils"
import Stateful from "./stateful"
import axios from "axios"

/**
 * Represents the different types of Astral Objects in the Megaverse
 */
export enum AstralObjectType {
    polyanet = 0,
    soloon = 1,
    cometh = 2,
}

/**
 * Represents the different names of Astral Objects in the Megaverse
 */
export enum AstralObjectName {
    space = "SPACE",
    polyanet = "POLYANET",
    soloon = "SOLOON",
    cometh = "COMETH",
}

/**
 * Represents a space in the Megaverse. Could either be an empty space or an Astral Object.
 */
export type AstralObjectOrSpace = AstralObject | null

/**
 * Represents an Astral Object in the Megaverse
 */
export default abstract class AstralObject implements Stateful {
    protected row: number
    protected column: number

    constructor(row: number, column: number) {
        validate(row >= 0, `Invalid row ${row}`)
        validate(column >= 0, `Invalid column ${column}`)
        this.row = row
        this.column = column
    }

    /**
     * Saves the Astral Object to the Megaverse API.
     * Each subclass should implement this method.
     */
    abstract save(): Promise<boolean>

    /**
     * Deletes the Astral Object from the Megaverse API. /api/polyanets is universal for all Astral Objects.
     * @returns true if the object was successfully deleted, false otherwise
     */
    async delete(): Promise<boolean> {
        const deleteUrl = getEndpoint(`/api/polyanets`)
        const res = await axios.delete(deleteUrl, {
            data: {
                candidateId: process.env.CANDIDATE_ID,
                row: this.row,
                column: this.column,
            },
        })
        return res.status === 200
    }
}
