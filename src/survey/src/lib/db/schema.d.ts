import { Layout } from "./layout";
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
     * Child nodes
     */
    items?: DBSchema[];
    /**
     * Layout
     */
    layout?: Layout;
    [k: string]: any;
}
