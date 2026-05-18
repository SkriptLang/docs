export enum DocumentableType {
    // syntax
    STRUCTURE = "Structure",
    SECTION = "Section",
    EFFECT = "Effect",
    CONDITION = "Condition",
    EXPRESSION = "Expression",
    EVENT = "Event",
    // types
    TYPE = "Type",
    // properties
    PROPERTY = "Property",
    // functions
    FUNCTION = "Function",
    // experiments
    EXPERIMENT = "Experiment",
}

export interface Documentable {
    type: DocumentableType,
}

export interface DocumentableReference {
    id: string,
    name: string,
}

/*
 * Generic
 */

export interface Documentation extends Documentable {
    origin: Origin,
    id: string,
    name: string,
    description: string,
    examples: string[],
    since: string[],
    requirements: string[],
    keywords: string[],
    deprecated: string[],
}

export interface Origin {
    name: string,
    class?: string,
    modules?: string[],
}

export interface ExperimentData {
    required: DocumentableReference[],
    disallowed: DocumentableReference[],
}

/*
 * Syntax
 */

export interface Syntax extends Documentation {
    patterns: string[],
    events?: DocumentableReference[],
    relatedProperty?: DocumentableReference,
    experimentData?: ExperimentData,
}

export enum ChangeMode {
    ADD = "Add",
    SET = "Set",
    REMOVE = "Remove",
    REMOVE_ALL = "Remove All",
    DELETE = "Delete",
    RESET = "Reset",
}

export interface Expression extends Syntax {
    returnType: DocumentableReference,
}

export interface Event extends Syntax {
    cancellable: boolean,
    eventValues: EventValue[],
}
export interface EventValue {
    type: DocumentableReference,
    plural: boolean,
    time: keyof typeof EventValueTime,
    patterns: string[],
    supportedChangeModes: (keyof typeof ChangeMode)[],
}
export enum EventValueTime {
    PAST = "Past",
    NOW = "Present",
    FUTURE = "Future",
}

/*
 * Types
 */

export interface Type extends Documentation {
    usage?: string[],
    properties: {
        property: DocumentableReference,
        origin: Origin,
        description: string,
    }[],
}

/*
 * Properties
 */

export interface Property extends Documentation {
    types: DocumentableReference[],
    syntaxes: DocumentableReference[],
}

/*
 * Functions
 */

export interface Function extends Documentation {
    returnType?: DocumentableReference,
    parameters?: {
        [key: string]: {
            name: string,
            type: DocumentableReference,
            plural: boolean,
            modifiers: {
                optional?: boolean,
                ranged?: {
                    min: number,
                    max: number,
                },
            }
        }
    },
}

/*
 * Experiments
 */

export interface Experiment extends Documentation {
    pattern: string,
}
