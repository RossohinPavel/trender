export type cell = string | number | object;

export type row = {[key:string]: cell} | cell[];

export type tableSection = {[key:string]: row} | row[];

export type tableData = {thead?: tableSection, tbody: tableSection, tfoot?: tableSection, [key:string]: any}
