import { getEndpoint, validate } from "./utils"
import {
    AstralObjectType,
    AstralObjectName,
    AstralObjectOrSpace,
} from "./astralObject"
import Polyanet from "./polyanet"
import Soloon from "./soloon"
import Cometh from "./cometh"
import axios from "axios"

/**
 * Represents the Megaverse Map.
 */
export default class MegaverseMap {
    phase: number
    map: AstralObjectOrSpace[][]

    constructor(phase: number, map: AstralObjectOrSpace[][]) {
        validate(
            [1, 2].includes(phase),
            "The phase of the challenge can only be 1 or 2",
        )
        validate(map.length > 0, "Cannot have an empty map")

        this.phase = phase
        this.map = map
    }

    /**
     * Makes an API call to get the Megaverse Map API and properly parses it.
     * @returns the Megaverse Map
     */
    static async getMap(): Promise<MegaverseMap> {
        // performing get request
        const mapUrl = getEndpoint(`/api/map/${process.env.CANDIDATE_ID}`)
        try {
            const res = await axios.get(mapUrl)
            validate(
                res.status === 200,
                `Error getting the megaverse map: status ${res.statusText}`,
            )

            // Parsing the object
            const megaverseMap = res.data
            const phase = megaverseMap.map.phase
            const mapContent = megaverseMap.map.content

            // Serializing into an array
            const planets = []
            for (let row = 0; row < mapContent.length; row++) {
                let newPlanetsRow = []

                for (
                    let column = 0;
                    column < mapContent[row].length;
                    column++
                ) {
                    const planet = mapContent[row][column]

                    if (planet === null) {
                        newPlanetsRow.push(null)
                    } else {
                        switch (planet.type) {
                            case AstralObjectType.polyanet:
                                newPlanetsRow.push(new Polyanet(row, column))
                                break
                            case AstralObjectType.soloon:
                                newPlanetsRow.push(
                                    new Soloon(row, column, planet.color),
                                )
                                break
                            case AstralObjectType.cometh:
                                newPlanetsRow.push(
                                    new Cometh(row, column, planet.direction),
                                )
                                break
                            default:
                                throw new Error(
                                    `Unrecognized planet of type: ${planet.type}`,
                                )
                        }
                    }
                }
                planets.push(newPlanetsRow)
            }

            return new MegaverseMap(phase, planets)
        } catch (error) {
            throw error
        }
    }

    /**
     * Makes an API call to get the goal of the Megaverse Map and properly parses it.
     * @returns the goal of the Megaverse Map
     */
    static async getGoal(): Promise<AstralObjectOrSpace[][]> {
        const goalUrl = getEndpoint(`api/map/${process.env.CANDIDATE_ID}/goal`)
        try {
            const res = await axios.get(goalUrl)
            validate(
                res.status === 200,
                `Error getting the megaverse goal: status ${res.statusText}`,
            )

            const goalMap = res.data.goal

            // Modyfing in place
            for (let row = 0; row < goalMap.length; row++) {
                for (let column = 0; column < goalMap[row].length; column++) {
                    const astralObject = goalMap[row][column] as string

                    if (astralObject === AstralObjectName.space) {
                        goalMap[row][column] = null
                    } else if (astralObject === AstralObjectName.polyanet) {
                        goalMap[row][column] = new Polyanet(row, column)
                    } else {
                        const [characteristic, astralType] =
                            astralObject.split("_")

                        if (astralType === AstralObjectName.cometh) {
                            goalMap[row][column] = new Cometh(
                                row,
                                column,
                                characteristic.toLowerCase(),
                            )
                        } else if (astralType === AstralObjectName.soloon) {
                            goalMap[row][column] = new Soloon(
                                row,
                                column,
                                characteristic.toLocaleLowerCase(),
                            )
                        } else {
                            throw new Error(
                                `Unrecognized astral object of type: ${astralType}`,
                            )
                        }
                    }
                }
            }

            return goalMap
        } catch (err) {
            throw err
        }
    }

    /**
     * Clears the current map.
     * @returns A list of booleans indicating if the deletion was successful.
     */
    async clearMap(): Promise<boolean[]> {
        // Flatten the map, filter out the null values, and then delete the astral objects
        return Promise.all(
            this.map
                .flat()
                .filter((astralObject) => astralObject !== null)
                .map((astralObject) => astralObject!.delete()),
        )
    }

    /**
     * Applies the goal to the current map.
     * @param goal The goal to apply to the map.
     * @returns A list of booleans indicating if the application was successful.
     */
    async applyGoal(goal: AstralObjectOrSpace[][]): Promise<boolean[]> {
        // Flatten the map, filter out the null values, and then save the astral objects
        return Promise.all(
            goal
                .flat()
                .filter((astralObject) => astralObject !== null)
                .map((astralObject) => astralObject!.save()),
        )
    }

    /**
     * Gets the number of rows in the map.
     * @returns the number of rows in the map
     */
    getRows(): number {
        return this.map.length
    }

    /**
     * Gets the number of columns in the map.
     * @returns the number of columns in the map
     */
    getColumns(): number {
        return this.map[0].length
    }
}
