export type cell = string | number | object;
export type row = {[key:string]: cell} | cell[];
export type tablePart = {[key:string]: row} | row[];
export type table = {thead?: tablePart, tbody: tablePart, tfoot?: tablePart, [key:string]: any}
export type trenderArgs = {data: table, divId: string, id: string};
