import {ListColumn} from "./ListColumn";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.03
 */
export interface ListRow {
	id: string;
	values: Map<ListColumn, string>;
}
