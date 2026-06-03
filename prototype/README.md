# Templafy MCP OAuth Prototype

Open `index.html` in a browser.

Useful direct routes:

- `index.html#flow` - full left-to-right flow map
- `index.html#directory` - connector directory
- `index.html#detail` - Templafy connector detail
- `index.html#signup` - single landing page for free product and existing-customer access
- `index.html#authChoice` - compatibility alias for the landing page
- `index.html#selectTenant` - rare account selector for users with multiple tenants
- `index.html#loginMethod` - legacy/debug login method selection, not part of the normal path
- `index.html#login` - email/password login after identification
- `index.html#tenantCheck` - optional engineering view of the customer capability decision
- `index.html#profile` - optional direct route showing that email verification is enough
- `index.html#consent` - rare consent branch
- `index.html#connected` - connected return page

Prototype paths:

- Existing customer with MCP enabled: choose `Existing customer`, enter email, complete Microsoft sign-in if needed, then connect.
- Existing enterprise SSO user with multiple tenants: choose `Rare: tenants`, enter email, select account, complete Microsoft sign-in if needed, then connect.
- Existing email-auth user: choose `Email auth`, enter email, enter password, then connect.
- Agents enabled but no MCP (v2): choose `Agents enabled but no MCP (v2)`, enter email, authenticate, then allow access only if consent is missing.
- Existing user with no agents: choose `No agents`, enter email, then route to the free-product flow with the same email.
- Unknown user: choose `Free product` or click `Start free product`, verify the email link, then enter the free product. Internally this creates a freemium tenant.

Case B behavior:

- Document Agents active means no setup blocker.
- Consent is shown only if the tenant still needs it.
- The user-facing screen says Templafy will notify the customer team, while the implementation details sit in sticky-note annotations.
