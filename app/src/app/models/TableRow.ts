import {TableColumn} from "./TableColumn";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.03
 */
export interface TableRow {
	id: string;
	values: Map<TableColumn, string>;
}
