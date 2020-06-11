import {ListColumn} from "./ListColumn";
import {ListRow} from "./ListRow";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.03
 */
export interface List {
	id: string;
	deckId: string;
	name: string;
	columns: ListColumn[];
	rows: ListRow[];
}
