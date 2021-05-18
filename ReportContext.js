import React from "react";
import createContextConnector from "lib/createContextConnector";

/**
 * @typedef {object} ReportFilter
 * @property {array} dateRange
 * @property {function} setDateRange
 * @property {function} handleFilterClick
 */
const ReportContext = React.createContext();

export const connectToContext = createContextConnector(ReportContext);

export default ReportContext;
