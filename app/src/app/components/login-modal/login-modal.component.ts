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

import UIkit from 'uikit';

import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {UserSessionService} from "@app/services/user-session.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.sass']
})
export class LoginModalComponent implements AfterViewInit {

	@ViewChild("loginModal", {static: true})
	modal: ElementRef | undefined;

	@ViewChild("userUsernameInput")
	usernameInputElement: ElementRef | undefined;

	@Input()
	existingUser: boolean = true;

	usernameInput: FormControl<string> = new FormControl<string>('', { nonNullable: true });
	passwordInput: FormControl<string> = new FormControl('', { nonNullable: true });
	passwordConfirmationInput: FormControl<string> = new FormControl('', { nonNullable: true });

	loginErrorMessage: string = '';
	requestInProgress: boolean = false;

	constructor(
		private readonly userSessionService: UserSessionService) {
	}

	public ngAfterViewInit(): void {
		if (this.modal) {
			// @ts-ignore
			UIkit.util.on(this.modal.nativeElement, 'hidden', _ => {
				this.loginErrorMessage = '';
			});

			// @ts-ignore
			UIkit.util.on(this.modal.nativeElement, 'shown', _ => {
				this.usernameInputElement?.nativeElement.focus();
			});
		}
	}

	public openDialog(): void {
		if (!this.modal) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();
		this.usernameInput.setValue('');
		this.passwordInput.setValue('');
		this.passwordConfirmationInput.setValue('');
	}

	public async submitCredentials(): Promise<void> {
		this.requestInProgress = true;
		const username = this.usernameInput.value.trim().normalize();
		const password = this.passwordInput.value;

		if (this.validateUsername(username) && this.validatePassword(password)) {
			try {
				if (this.existingUser) {
					await this.userSessionService.login(username, password);
				} else {
					await this.userSessionService.register(username, password);
				}
				if (this.modal) {
					UIkit.modal(this.modal.nativeElement).hide();
				}
			} catch (e) {
				if (e instanceof Error) {
					this.loginErrorMessage = e.message;
				}
			}
		}
		this.requestInProgress = false;
	}

	private validatePassword(password: string): boolean {
		if (this.existingUser) {
			if (password.length === 0) {
				this.loginErrorMessage = 'Password cannot be empty.';
				return false;
			}
		} else {
			if (password.length < 8) {
				this.loginErrorMessage = 'Password has to be at least 8 characters long.';
				return false;
			} else if (this.passwordConfirmationInput.value !== password) {
				this.loginErrorMessage = 'Passwords do not match.';
				return false;
			}
		}
		return true;
	}

	private validateUsername(username: string): boolean {
		if (username.includes(' ')) {
			this.loginErrorMessage = 'Username cannot contain spaces.';
			return false;
		}
		if (this.existingUser) {
			if (username.length === 0) {
				this.loginErrorMessage = 'Username cannot be empty.';
				return false;
			}
		} else {
			if (username.length < 5) {
				this.loginErrorMessage = 'Usernames must be at least 5 characters long.';
				return false;
			}
		}
		return true;
	}
}
