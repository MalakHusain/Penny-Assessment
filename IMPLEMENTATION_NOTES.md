# Implementation Notes


## Screens and State

The application has two main screens: a Change Request list and a Change Request detail page. The list loads Change Requests for the current user and handles loading, loaded, empty, and error states, with a status filter for narrowing the displayed requests. The detail page loads one Change Request and shows its proposed changes, totals, and approval timeline. Approve and Reject actions should depend on both the Change Request status and the current user's permissions, and the UI should handle loading and API errors clearly.

> Fill this in as part of your submission. 1–2 pages, bullet points are fine. Delete these
> instructions before submitting.

## 1. What I changed
<!-- Grouped by task: bugs fixed and features implemented (component + template). -->
-
- Fixed the line-item diff logic so quantity changes are correctly classified as `changed`, not only unit price changes.
- Updated the Approve permission logic so a Change Request must be `PENDING_APPROVAL` and the current user must have an approval policy before Approve is enabled.
- Implemented the Change Request status filter so selecting a status narrows the rendered list, while `ALL` continues to show all requests.
- Added list component tests covering status filtering, loading, empty, loaded, and API error states.


## 2. Component & state model
<!-- The screens, the view-state each component exposes, and how data flows from the mock API into the
template. -->

-

## 3. Invariants I keep
<!-- Which properties the UI guarantees, and where in the component/template each is enforced. -->

| Invariant | How / where |
|---|---|

## 4. Testing strategy
<!-- What you tested (component/DOM vs pure) and why; what you deliberately skipped given the budget. -->
- Added DOM-level coverage for the Change Request list to verify the rendered status filter behavior and loading/error UI states.
- Ran the full Jest test suite after the Task 2 changes. All 10 tests pass.

-

- Ran the existing Jest test suite after the Task 1 fixes. All 7 tests pass.

## 5. Assumptions
<!-- Where the requirements left room for interpretation, the calls you made and why. -->

-

## 6. Where I used AI
- I used AI as a learning and development aid during the assessment. Since Angular/Jest component testing was relatively new to me, I used AI to help understand the existing test structure and to suggest test cases for the list filtering, loading, and error states. I reviewed the suggested code, worked through how each test behaved, and ran the full test suite to verify the implementation. I also used AI to help interpret requirements and debug failing tests.

## 7. What I'd improve with more time
-
