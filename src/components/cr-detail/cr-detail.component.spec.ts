import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrDetailComponent } from './cr-detail.component';
import { SessionService } from '../../session/session.service';
import { users } from '../../api/fixtures';
import { ReqUser } from '../../models/cr.models';
import { CrApiService } from '../../api/cr-api.service';


const flush = () => new Promise((r) => setTimeout(r, 0));

async function render(user: ReqUser, id: string): Promise<ComponentFixture<CrDetailComponent>> {
	TestBed.configureTestingModule({
		imports: [CrDetailComponent],
		providers: [{ provide: SessionService, useValue: { user } }],
	});
	await TestBed.compileComponents();
	const fixture = TestBed.createComponent(CrDetailComponent);
	fixture.componentInstance.id = id;
	fixture.detectChanges(); // ngOnInit -> load()
	await flush(); // let the mock API resolve
	fixture.detectChanges(); // render the loaded state
	return fixture;
}

describe('CrDetailComponent', () => {
	it('loads and renders the change request title', async () => {
		const fixture = await render(users.approver, 'CR-1');
		expect(fixture.nativeElement.querySelector('.cr-detail__header h2').textContent).toContain('Add 1 unit of SKU-A');
	});

	it('disables Approve for a read-only viewer on a pending CR', async () => {
		const fixture = await render(users.viewer, 'CR-1'); // viewer: cr_r_o only; CR-1 is PENDING_APPROVAL
		const approveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.cr-actions__approve');
		expect(approveBtn.disabled).toBe(true);
	});


it('renders the timeline chronologically', async () => {
    const fixture = await render(users.approver, 'CR-1');

    const entries = Array.from(
        fixture.nativeElement.querySelectorAll('.cr-timeline__entry')
    ) as HTMLElement[];

    expect(entries[0].textContent).toContain('CREATE');
    expect(entries[1].textContent).toContain('SUBMIT');
    expect(entries[2].textContent).toContain('SEND_FOR_APPROVAL');
});



it('disables Reject until a valid reason is entered', async () => {
    const fixture = await render(users.approver, 'CR-1');

    const rejectBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.cr-actions__reject-btn');

    expect(rejectBtn.disabled).toBe(true);

    fixture.componentInstance.rejectControl.setValue('   ');
    fixture.detectChanges();

    expect(rejectBtn.disabled).toBe(true);

    fixture.componentInstance.rejectControl.setValue('Budget is too high');
    fixture.detectChanges();

    expect(rejectBtn.disabled).toBe(false);
});



it('approves a pending change request', async () => {
    const fixture = await render(users.approver, 'CR-1');

    const approveBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.cr-actions__approve');

    approveBtn.click();
    fixture.detectChanges();

    await flush();
    fixture.detectChanges();

    const status: HTMLElement =
        fixture.nativeElement.querySelector('.cr-status');

    expect(status.textContent).toContain('APPROVED');
    expect(approveBtn.disabled).toBe(true);
});


it('rejects a pending change request with a valid reason', async () => {
    const fixture = await render(users.approver, 'CR-1');

    fixture.componentInstance.rejectControl.setValue('Budget is too high');
    fixture.detectChanges();

    const rejectBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.cr-actions__reject-btn');

    rejectBtn.click();
    fixture.detectChanges();

    await flush();
    fixture.detectChanges();

    const status: HTMLElement =
        fixture.nativeElement.querySelector('.cr-status');

    expect(status.textContent).toContain('REJECTED');
});



it('disables Approve while the API request is pending', async () => {
    const fixture = await render(users.approver, 'CR-1');
    const api = TestBed.inject(CrApiService);

    jest.useFakeTimers();
    api.latencyMs = 100;

    const approveBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.cr-actions__approve');

    approveBtn.click();
    fixture.detectChanges();

    expect(approveBtn.disabled).toBe(true);

    jest.advanceTimersByTime(100);
    await Promise.resolve();
    fixture.detectChanges();

    jest.useRealTimers();
});



it('shows an error and allows retry when Approve fails', async () => {
    const fixture = await render(users.approver, 'CR-1');
    const api = TestBed.inject(CrApiService);

    api.failNext = true;

    const approveBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.cr-actions__approve');

    approveBtn.click();
    fixture.detectChanges();

    await flush();
    fixture.detectChanges();

    const error: HTMLElement =
        fixture.nativeElement.querySelector('.cr-actions__error');

    expect(error.textContent).toContain('Network error');
    expect(approveBtn.disabled).toBe(false);
});

});
