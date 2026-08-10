# AccountsScreen

## Question

Build the first real, fully wired screen — a list of financial accounts:

- List view: AccountCard component showing name, icon, color, and balance
- Create account: "Add Account" button → form (name, currency, color picker, icon picker)
- Empty state when no accounts exist
- Loading/error states
- Delete account (swipe or long-press)

Wire it to the real Account store (from #8). Uses local form state for the create/edit form (decision #21).

## Dependencies

- Blocked by #9 (Navigation skeleton — route must exist)
- Blocked by #8 (Account store)
- Blocked by #7 (Account data layer)
