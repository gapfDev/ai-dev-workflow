# AGENT DELEGATION

- **Manager Agent**: Coordination and merge strategy.
- **Cart_Agent**: Ticket #1 ownership.
- **Checkout_Agent**: Ticket #2 ownership (waits on Cart_Agent for OrderService.ts).
- **Profile_Agent**: Ticket #3 ownership.
