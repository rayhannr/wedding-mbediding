# Digital Wedding Invitation

A modern, customizable digital wedding invitation built with Astro, React, Tailwind CSS, and Supabase. Features a beautiful UI with dark mode support, admin dashboard for managing invitees and RSVPs, and real-time wish messages from guests.

## Features

- Modern UI with dark mode support
- Fully responsive design
- Admin dashboard for managing:
  - Guest list and invitations
  - RSVP responses
  - Wish messages
- Unique invitation links for each guest
- Real-time wish messages from guests
- Dark/Light mode toggle
- Location map integration
- Wedding countdown timer

## Getting Started

1. Clone this repository

```bash
git clone https://github.com/rayhannr/astro-wedding.git
cd astro-wedding
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

- Copy `.env.template` to `.env`
- Fill in the required environment variables (see Configuration section below)

4. Set up Supabase

- Create a new Supabase project at https://supabase.com
- Copy your project's API URL and anon key
- Push the migrations to your Supabase project:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase init
npx supabase db push
```

5. Enable registration and create admin account

- Start the development server and create your admin account at `/register`
- Confirm the registration from your email
- Get your user ID from Supabase Authentication dashboard
- Add your user ID as `ADMIN_USERID` in `.env`
- Re-disable registration by reverting the changes in RegisterForm.tsx and register.ts

6. Start the development server

```bash
npm run dev
```

## Configuration

Copy `.env.template` to `.env` and configure the following variables:

### Supabase Configuration

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `SUPABASE_URL`         | Your Supabase project URL                       |
| `SUPABASE_ANON_KEY`    | Your Supabase project anon key                  |
| `SUPABASE_DB_PASSWORD` | Your Supabase database password                 |
| `ADMIN_USERID`         | Your admin account's user ID from Supabase Auth |

### Bride & Groom Information

| Variable         | Description                              |
| ---------------- | ---------------------------------------- |
| `GROOM_FULLNAME` | Full name of the groom                   |
| `GROOM_TITLE`    | Academic/professional title of the groom |
| `GROOM_NICKNAME` | Nickname of the groom                    |
| `GROOM_PARENTS`  | Parents' names of the groom              |
| `GROOM_ROLE`     | Role in family (e.g., "First son")       |
| `BRIDE_FULLNAME` | Full name of the bride                   |
| `BRIDE_TITLE`    | Academic/professional title of the bride |
| `BRIDE_NICKNAME` | Nickname of the bride                    |
| `BRIDE_PARENTS`  | Parents' names of the bride              |
| `BRIDE_ROLE`     | Role in family (e.g., "Only daughter")   |

### Event Details

| Variable        | Description                         |
| --------------- | ----------------------------------- |
| `WEDDING_DATE`  | Wedding date and time in ISO format |
| `VENUE_NAME`    | Name of the wedding venue           |
| `VENUE_ADDRESS` | Full address of the venue           |
| `VENUE_GMAPS`   | Google Maps link to the venue       |

## 🧞 Available Commands

| Command             | Action                                        |
| :------------------ | :-------------------------------------------- |
| \`npm install\`     | Installs dependencies                         |
| \`npm start\`       | Starts local dev server at \`localhost:3000\` |
| \`npm run build\`   | Build your production site to \`./dist/\`     |
| \`npm run preview\` | Preview your build locally, before deploying  |

## Customization

### General Customization

- Modify colors and theme in `src/styles/globals.css`
- Update UI components in `src/components/`
- Customize invitation content in `src/pages/[id].astro`
- Modify admin dashboard in `src/components/admin/`

### Note

#### Gift section

Bank accounts and shipping address are hardcoded in `src/components/invitation/Gift.astro` instead of using environment variables. This is because they require a more complex structure (with colors, icons, and copy button configurations) that would be cumbersome to manage through environment variables.

### Environment variables

`ADMIN_USERID` can't be empty even if you haven't registered an account. You can follow the `.env.template` by setting it to `dummyid` to start.
