/**
 * Interface for stateful objects that can be saved and deleted with API calls
 */
export default interface Stateful {
    save(): Promise<boolean>
    delete(): Promise<boolean>
}
