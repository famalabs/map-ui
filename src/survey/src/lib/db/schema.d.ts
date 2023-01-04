import { Layout } from './layout';
/**
 * Schema which represents the serialization of a generic node
 * @interface
 */
export interface DBSchema {
    /**
     * Id of the node
     */
    id: string;
    /**
     * Type of the node
     */
    type: string;
    /**
     * Descriptive name of the node (uniqueness not guaranted)
     */
    name?: string;
    /**
     * Text associated to the node
     */
    text?: string;
    /**
     * description
     */
    description?: string;
    /**
     * Child nodes
     */
    items?: DBSchema[];
    /**
     * Layout
     */
    layout?: Layout;
}
export interface ExtendedSchema extends DBSchema {
    items?: ExtendedSchema[];
    [k: string]: any;
}
