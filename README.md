# Sveltekit Financial Dashboard

The source code for the financial dashboard that I use to monitor my assets, balances and credit cards.

### Main Packages

[![Sveltekit](https://img.shields.io/badge/sveltekit-gray?logo=svelte&style=for-the-badge)](https://kit.svelte.dev/)
[![Plaid](https://img.shields.io/badge/plaid-gray?logo=diaspora&style=for-the-badge)](https://plaid.com/docs/)
[![Zod](https://img.shields.io/badge/zod-gray?logo=zod&style=for-the-badge)](https://zod.dev/)
[![Pocketbase](https://img.shields.io/badge/pocketbase-gray?logo=pocketbase&style=for-the-badge)](https://pocketbase.io/)
[![DaisyUI](https://img.shields.io/badge/daisyui-gray?logo=daisyui&style=for-the-badge)](https://daisyui.com/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-gray?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)

### Routes

```gql
routes
 ├── /
 └── (admin)
      ├── login
      │   └── "Place auth cookie onto browser"
      └── token
          └── "Exchange public_token for access_token"
```

## Roadmap

- [ ] Deploy app and database
- [ ] Upgrade Plaid
  - [ ] Up plaid tier to enable OAuth
  - [ ] Implement OAuth routing for banks that require it.
- [ ] Set up [Sentry](https://sentry.io/) to move errors out of the console
- [ ] Set up [New Relic](https://newrelic.com/) for site analytics
