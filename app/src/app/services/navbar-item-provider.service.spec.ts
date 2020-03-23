import {TestBed} from '@angular/core/testing';

import {NavbarItemProviderService} from './navbar-item-provider.service';

describe('NavbarItemProviderService', () => {
	let service: NavbarItemProviderService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NavbarItemProviderService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
