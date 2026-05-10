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

export interface Origin {
    name: string,
}

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

export interface Syntax extends Documentation {
    patterns: string[],
    events?: DocumentableReference[],
    relatedProperty?: DocumentableReference,
}

export interface Expression extends Syntax {
    returnType: DocumentableReference,
}

export interface Type extends Documentation {
    usage?: string[],
    properties: {
        property: DocumentableReference,
        origin: Origin,
        description: string,
    }[],
}

export interface Property extends Documentation {
    types: DocumentableReference[],
    syntaxes: DocumentableReference[],
}

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

export interface Experiment extends Documentation {
    pattern: string,
}
