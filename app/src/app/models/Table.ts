import {TableColumn} from "./TableColumn";
import {TableRow} from "./TableRow";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.03
 */
export interface Table {
	id: string;
	deckId: string;
	name: string;
	columns: TableColumn[];
	rows: TableRow[];
}
