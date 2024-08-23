import url from "node:url"

/**
 * Validates the expression and throws an error if it is false
 * @param expression - The expression to validate
 * @param message  - The message to throw if the expression is false
 */
export function validate(expression: boolean, message: string) {
    if (!expression) {
        throw new Error(message)
    }
}

/**
 * Properly concatenates the base URL with the path to the endpoint
 * @param path - The partial path to the endpoint
 * @returns The full URL for the endpoint as a string
 */
export function getEndpoint(path: string): string {
    const baseUrl = process.env.BASE_URL

    const newUrl = new url.URL(path, baseUrl)
    return newUrl.toString()
}
