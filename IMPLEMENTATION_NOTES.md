## 1. What I changed

- Reviewed the existing project structure, models, fixtures, mock API, permissions, and component templates before making changes.
- Fixed the line-item diff logic so changes to quantity, unit price, or description are correctly classified as `changed`.
- Updated the Approve permission logic so a Change Request must be `PENDING_APPROVAL` and the current user must have an approval policy before Approve is enabled.
- Implemented the Change Request status filter so selecting a status narrows the rendered list, while `ALL` continues to show all requests.
- Added explicit loading, empty, loaded, and error behavior to the Change Request list.
- Updated the detail view to render the line-item diff as `added`, `removed`, `changed`, or `unchanged`.
- Displayed the baseline total, proposed total, and delta in the detail view.
- Sorted timeline entries chronologically without mutating the original audit array.
- Fixed detail navigation so selecting a different Change Request reloads the detail component correctly.
- Added permission-aware Approve and Reject actions.
- Implemented Approve and Reject API calls and update the rendered detail using the API response.
- Added required rejection-reason validation, including rejecting whitespace-only reasons.
- Added a submitting state so action buttons are disabled while an API request is pending, preventing duplicate submissions.
- Added visible action-level error feedback and restored the actions after a failed API request so the user can retry.
- Added component/DOM and pure-function tests for the main workflows and edge cases.


## 2. Component & state model

- `CrListComponent` owns the list view state and loads Change Request summaries from the mock API.
- The list uses explicit `loading`, `loaded`, and `error` states so the template always has a defined UI state.
- `visibleRows` derives the rows shown in the table from the loaded data and the selected status filter without modifying the original API data.
- `CrDetailComponent` owns the currently selected Change Request detail state.
- When the selected Change Request ID changes, the detail component reloads the corresponding data.
- The detail component derives the diff and chronological timeline from the loaded Change Request.
- Approve and Reject call the mock API and replace the current detail state with the returned Change Request.
- `submitting` represents an in-progress action request and is used to disable actions until the request settles.
- `actionError` represents an Approve/Reject failure and is rendered separately from the initial detail-loading error.
- `rejectControl` owns the rejection reason and validates that a meaningful, non-whitespace reason is provided.


## 3. Invariants I keep

| Invariant | How / where |
|---|---|
| Only a pending Change Request can be approved | `canApprove` requires `PENDING_APPROVAL` |
| Approval also requires an approval policy | `canApprovePolicy(this.session.user)` is checked |
| Reject follows the same status and approval-policy restriction | `canReject` checks status and approval policy |
| A rejection requires a meaningful reason | Reactive form validation uses `required` and a non-whitespace pattern; `reject()` also trims and guards the value |
| Duplicate action submissions are blocked | Buttons are disabled while `submitting` is true and the component methods also guard against another submission |
| Failed actions do not leave the UI permanently disabled | `submitting` is reset in `finally` and `actionError` is displayed |
| Diff rows reflect relevant line-item changes | Quantity, unit price, and description are compared |
| Timeline is shown oldest to newest | A copied audit array is sorted by timestamp |
| Filtering does not mutate the loaded list | `visibleRows` returns a derived filtered array |
| Read-only users have no enabled approval actions | Permission checks prevent Approve/Reject execution |


## 4. Testing strategy

- Used pure unit tests for `computeDiff` because the classification logic can be tested independently from Angular rendering.
- Covered `added`, `removed`, `unchanged`, quantity-only changes, and description-only changes in the diff tests.
- Used Angular component/DOM tests for behavior that matters to the user, including rendered list filtering and UI states.
- Tested list loading, loaded, empty, and API error states.
- Tested that the detail timeline renders chronologically.
- Tested that a read-only user cannot approve a pending Change Request.
- Tested that Reject remains disabled until a valid rejection reason is entered, including the whitespace-only edge case.
- Tested successful Approve and Reject flows and verified the resulting rendered status.
- Tested slow API behavior to verify that Approve is disabled while the request is pending.
- Tested API failure behavior to verify that an error is shown and the action becomes available for retry.
- Used the mock API controls such as `latencyMs` and `failNext` to exercise slow and failing requests deterministically.
- Ran the full Jest suite throughout the implementation. The final suite contains 18 passing tests across 3 test suites.


## 5. Assumptions

- The mock API is treated as the application contract, so status transitions are performed through the API rather than directly mutating Change Request status in the component.
- Because the provided permission model exposes approval policies but no separate rejection policy, Reject uses the same approval-policy check as Approve.
- A Change Request that is not `PENDING_APPROVAL` cannot be approved or rejected even if the current user has an approval policy.
- A whitespace-only rejection reason is not considered a valid reason.
- Timeline entries are displayed chronologically from oldest to newest.
- The list owns its own summary state separately from the detail component; this implementation does not automatically refresh the list summary after a detail action.


## 6. Where I used AI

- I used AI as a learning and development aid during the assessment, particularly because Angular/Jest component testing was relatively new to me.
- I used AI to help interpret parts of the requirements, understand the existing Angular/Jest test structure, debug failing tests, and suggest test cases for filtering, permissions, validation, slow requests, and API failures.
- AI also assisted with suggestions for parts of the component and test implementation. I reviewed the suggested changes, worked through how they behaved, adapted them to the existing project structure, and ran the full test suite to verify the final behavior.
- I used the existing project models, fixtures, mock API, and requirements as the source of truth rather than changing the API contract.


## 7. What I'd improve with more time

- Refresh or synchronize the list summary after an Approve or Reject action so the status shown in the list immediately matches the updated detail view.
- Make description-only line-item changes more visually explicit in the diff table by showing the before and after descriptions.
- Add more accessibility-focused tests for keyboard interaction, focus behavior, and screen-reader labels.
- Add additional tests around rapid navigation between Change Requests while requests are still in flight.
- Improve visual polish and responsive behavior while keeping the workflow and state model unchanged.