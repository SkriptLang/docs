export enum DocumentableType {
    // syntax
    Structure = "structure",
    Section = "section",
    Effect = "effect",
    Condition = "condition",
    Expression = "expression",
    Event = "event",
    EntityData = "entity_data",
    // types
    Type = "type",
    // properties
    Property = "property",
    // functions
    Function = "function",
    // experiments
    Experiment = "experiment",
}
export const DocumentableTypeMeta: Record<DocumentableType, { label: string }> = {
    [DocumentableType.Structure]: {
        label: "Structure"
    },
    [DocumentableType.Section]: {
        label: "Section"
    },
    [DocumentableType.Effect]: {
        label: "Effect"
    },
    [DocumentableType.Condition]: {
        label: "Condition"
    },
    [DocumentableType.Expression]: {
        label: "Expression"
    },
    [DocumentableType.Event]: {
        label: "Event"
    },
    [DocumentableType.EntityData]: {
        label: "Entity Data"
    },
    [DocumentableType.Type]: {
        label: "Type"
    },
    [DocumentableType.Property]: {
        label: "Property"
    },
    [DocumentableType.Function]: {
        label: "Function"
    },
    [DocumentableType.Experiment]: {
        label: "Experiment"
    },
}

export enum DocumentableSubType {
    EffectSection = "effect_section",
    SectionExpression = "section_expression",
}
export const DocumentableSubTypeMeta: Record<DocumentableSubType, { label: string }> = {
    [DocumentableSubType.EffectSection]: {
        label: "Effect Section"
    },
    [DocumentableSubType.SectionExpression]: {
        label: "Section Expression"
    },
}

export function includesSubType(type: DocumentableType, subType: DocumentableSubType): boolean {
    if (subType == DocumentableSubType.EffectSection) {
        return type == DocumentableType.Section || type == DocumentableType.Effect;
    } else if (subType == DocumentableSubType.SectionExpression) {
        return type == DocumentableType.Expression || type == DocumentableType.Section;
    }
    return false;
}

export interface Documentable {
    type: DocumentableType,
    subType?: DocumentableSubType,
    id: string,
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
    Add = "ADD",
    Set = "SET",
    Remove = "REMOVE",
    RemoveAll = "REMOVE_ALL",
    Delete = "DELETE",
    Reset = "RESET",
}
export const ChangeModeMeta: Record<ChangeMode, { label: string }> = {
    [ChangeMode.Add]: {
        label: "Add"
    },
    [ChangeMode.Set]: {
        label: "Set"
    },
    [ChangeMode.Remove]: {
        label: "Remove"
    },
    [ChangeMode.RemoveAll]: {
        label: "Remove All"
    },
    [ChangeMode.Delete]: {
        label: "Delete"
    },
    [ChangeMode.Reset]: {
        label: "Reset"
    },
}

export interface Expression extends Syntax {
    returnType: DocumentableReference,
}

export interface Structure extends Syntax {
    nodeType: StructureNodeType,
    entries?: {
        [key: string]: StructureEntryData, // key is same as StructureEntryData.key
    },
}
export enum StructureNodeType {
    Simple = "SIMPLE",
    Section = "SECTION",
    Both = "BOTH",
}
export interface StructureEntryData {
    key: string,
    optional: string,
    multiple: string,
}

export interface Event extends Syntax {
    cancellable?: boolean,
    eventValues: EventValue[],
}
export interface EventValue {
    type: DocumentableReference,
    plural: boolean,
    time: EventValueTime,
    patterns: string[],
    supportedChangeModes: ChangeMode[],
}
export enum EventValueTime {
    Past = "PAST",
    Now = "NOW",
    Future = "FUTURE",
}
export const EventValueTimeMeta: Record<EventValueTime, { label: string }> = {
    [EventValueTime.Past]: {
        label: "Past"
    },
    [EventValueTime.Now]: {
        label: "Present"
    },
    [EventValueTime.Future]: {
        label: "Future"
    },
}

export interface EntityData extends Syntax {

}

/*
 * Types
 */

export interface Type extends Documentation {
    usage?: string[],
    codename: {
        singular: string,
        plural: string,
    },
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
        [key: string]: Parameter, // key is same as Parameter.name
    },
}

export interface Parameter {
    name: string,
    type: DocumentableReference,
    plural: boolean,
    modifiers: {
        // OPTIONAL
        optional?: boolean,
        // RANGED
        ranged?: {
            min: number,
            max: number,
        },
    }
}

/*
 * Experiments
 */

export interface Experiment extends Documentation {
    phase: ExperimentLifeCycle,
    pattern: string,
}

export enum ExperimentLifeCycle {
    Stable = "STABLE",
    Experimental = "EXPERIMENTAL",
    Deprecated = "DEPRECATED",
    Mainstream = "MAINSTREAM",
    Unknown = "UNKNOWN",
}
export const ExperimentLifeCycleMeta: Record<ExperimentLifeCycle, { label: string }> = {
    [ExperimentLifeCycle.Stable]: {
        label: "Stable"
    },
    [ExperimentLifeCycle.Experimental]: {
        label: "Experimental"
    },
    [ExperimentLifeCycle.Deprecated]: {
        label: "Deprecated"
    },
    [ExperimentLifeCycle.Mainstream]: {
        label: "Mainstream"
    },
    [ExperimentLifeCycle.Unknown]: {
        label: "Unknown"
    },
}

/*
 * Additional functions
 */

export function asReferenceLink(id: string): string {
    const params = new URLSearchParams();
    params.set('search', '#' + id);
    return '?' + params;
}
