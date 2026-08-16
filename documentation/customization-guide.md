# Customization Guide

## Branding & site identity

Edit the constants at the top of `config/config.php`:
`SITE_NAME`, `SITE_TAGLINE`, `SITE_URL`, `SITE_EMAIL`, `SITE_SUPPORT_EMAIL`,
`SITE_PHONE`, `SITE_ADDRESS`.

## Design tokens (colors, type, spacing)

All color, typography, and radius values live in `assets/css/tokens.css`
as CSS custom properties, split into a light-mode `:root` block and a
`[data-theme="dark"]` override block. Change a token once and it
propagates everywhere — no hunting through component CSS for hex codes.

The signature visual element (the "engagement log" phase strip on the
homepage) is defined in `assets/css/style.css` under `.engagement-log`
and rendered in `index.php` / `services.php`. It's built to represent a
real four-step consulting process — if you change the steps, update the
copy in both places.

## Navigation

Edit the `$navItems` array at the top of `includes/header.php`.

## Training catalog & CTF categories

Both `training.php` and `ctf.php` currently hold their content as PHP
arrays at the top of the file for simplicity. To move to database-backed
content, point the array-building code at `db()` and the `courses` /
`ctf_categories` tables defined in `database/schema.sql` — the rendering
markup below doesn't need to change.

## Blog posts

Posts live as an array in `pages/blog/index.php` (listing) and
`pages/blog/post.php` (full content, keyed by slug). For a larger blog,
migrate this to a `posts` database table following the same pattern as
`courses`.

## AI support widget behavior

- Quick-reply prompts: edit the `data-quick` buttons in
  `components/ai-support-widget.php`.
- Topic classification keywords and fallback replies: edit the `$topics`
  array and `fallbackReply()` function in `api/ai-support.php`.
- To enable live model replies instead of the rule-based fallback, set
  the `MERIDIAN_AI_API_KEY` environment variable (see the installation
  guide) — no code changes required.

## Legal page content

Legal pages (`pages/legal/*.php`) are plain PHP/HTML with the legal
copy inline. Have counsel review before using in production — the
included text is a reasonable starting template, not legal advice.
