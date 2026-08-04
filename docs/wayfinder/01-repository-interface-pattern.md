# Repository Interface Pattern

## Question

What is the exact pattern for repository interfaces in `core/`? We need to decide:
- Interface naming convention and shape
- How `neverthrow` Result types flow through them
- Whether to keep the service-layer wrapper or collapse into repositories
- Return types: raw domain models or pre-formatted view models?

The docs show a service layer (`transactionService.create()`) calling the database directly. With repository interfaces, services consume interfaces rather than calling WatermelonDB. But do we even need a service layer, or can stores call repositories directly?
