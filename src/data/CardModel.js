/**
 * @typedef {Object} Assignee
 * @property {string} name
 * @property {string} initials
 */

import {uid} from "../utils/helpers";

/**
 * @class
 */
export class Card {
    /**
     * @param {{id?:string, title:string, description?:string, priority?:string, status?:string, labels?:Array, assignee?:Assignee, dueDate?:string}} options
     */
    constructor({ id, columnId, title, description, priority, status, labels = [], assignee = null, dueDate = '' }) {
        this.id = id
        this.columnId = columnId
        this.title = title
        this.description = description || ''
        this.priority = priority || 'Medium'
        this.status = status || 'To Do'
        this.labels = labels
        this.assignee = assignee
        this.dueDate = dueDate
    }
}