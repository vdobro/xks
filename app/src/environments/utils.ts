/*
 * Copyright (C) 2020 Vitalijus Dobrovolskis
 *
 * This file is part of xks.
 *
 * xks is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * xks is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with xks; see the file LICENSE. If not,
 * see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.20
 */
export const stripTrailingSlash = (str: string): string => {
	return str.endsWith('/')
		? str.slice(0, -1)
		: str;
};

export const levenshtein = (a: string, b: string): number => {
	let t: number[] = [];
	let u: number[] = [];
	let m: number = a.length;
	let n: number = b.length;

	if (!m) {
		return n;
	}
	if (!n) {
		return m;
	}
	for (let j = 0; j <= n; j++) {
		t[j] = j;
	}
	for (let i = 1; i <= m; i++) {
		let j = 1;
		for (u = [i]; j <= n; j++) {
			u[j] = a[i - 1] === b[j - 1]
				? t[j - 1]
				: Math.min(t[j - 1], t[j], u[j - 1]) + 1;
		}
		t = u;
	}
	return u ? u[n] : 0;
};

export const enum ApplicationMode {
	PRODUCTION = "production",
	DEFAULT = "default",
}

export interface EnvironmentSettings {
	readonly mode: ApplicationMode;
	readonly serverUrl: string
	readonly databaseUrl: string;
}
