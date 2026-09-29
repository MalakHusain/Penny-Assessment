# Implementation Notes


## Screens and State

The application has two main screens: a Change Request list and a Change Request detail page. The list loads Change Requests for the current user and handles loading, loaded, empty, and error states, with a status filter for narrowing the displayed requests. The detail page loads one Change Request and shows its proposed changes, totals, and approval timeline. Approve and Reject actions should depend on both the Change Request status and the current user's permissions, and the UI should handle loading and API errors clearly.

> Fill this in as part of your submission. 1–2 pages, bullet points are fine. Delete these
> instructions before submitting.

## 1. What I changed
<!-- Grouped by task: bugs fixed and features implemented (component + template). -->

-

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

-

## 5. Assumptions
<!-- Where the requirements left room for interpretation, the calls you made and why. -->

-

## 6. Where I used AI
-

## 7. What I'd improve with more time
-
