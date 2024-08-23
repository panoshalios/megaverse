import * as dotenv from "dotenv"
import MegaverseMap from "./megaverseMap"
import { validate } from "./utils"
import axios from "axios"
import axiosThrottle from "axios-request-throttle"

dotenv.config()

// Verifying that the proper environment variables are set
validate(process.env.BASE_URL !== undefined, "BASE_URL not set")
validate(process.env.CANDIDATE_ID !== undefined, "CANDIDATE_ID not set")

// Global axios throttling of requests (Anything above 1 request per second will result in a 429. At least that was the case with this library)
const requestsPerSecond = Number(process.env.REQUESTS_PER_SECOND ?? 1)
axiosThrottle.use(axios, { requestsPerSecond: requestsPerSecond })

// STEPS
// Retrieve and parse the Megaverse Map
// Clear the map
// Retrieve and parse the GOAL state
// Push those requests to the Megaverse Map

console.log("Collecting the Megaverse state")
MegaverseMap.getMap().then(async (megaverseMap) => {
    console.log(`Challenge phase ${megaverseMap.phase}`)
    console.log("Clearing the Megaverse map")
    await megaverseMap.clearMap()
    console.log("Map cleared")
    console.log("Retrieving and parsing the GOAL state")
    const goalState = await MegaverseMap.getGoal()
    console.log("Completing the challenge")
    await megaverseMap.applyGoal(goalState)
    console.log("Challenge completed")
})
