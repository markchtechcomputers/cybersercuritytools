# Deployment Guide

## Pre-deployment checklist

- [ ] `APP_ENV=production` set (disables verbose error display)
- [ ] Valid TLS certificate installed; HTTPS redirection confirmed
- [ ] Database credentials set via environment variables, not committed to source control
- [ ] `logs/` and `uploads/` are writable by the web server user but not web-accessible
- [ ] `robots.txt` and `sitemap.xml` reflect your real domain
- [ ] `SITE_URL`, `SITE_EMAIL`, `SITE_PHONE`, `SITE_ADDRESS` in `config/config.php` updated for your organization
- [ ] Content-Security-Policy in `config/security.php` reviewed against any CDNs you actually use
- [ ] Database backups scheduled (see below)

## Recommended hosting shape

- Application server: PHP-FPM behind Nginx, or Apache with `mod_php`/PHP-FPM
- Database: managed MySQL/MariaDB with automated backups and restricted network access
- TLS termination at the load balancer or web server (Let's Encrypt is sufficient)

## Zero-downtime releases

1. Deploy new code to a fresh directory (e.g. `releases/<timestamp>`).
2. Run any new SQL migrations against the production database.
3. Atomically swap a `current` symlink to the new release directory.
4. Reload PHP-FPM/Apache to clear opcode cache if `opcache.validate_timestamps` is disabled.

## Backups

- Database: daily automated dumps (`mysqldump` or your provider's managed
  backup), retained for at least 30 days.
- Uploaded files (`uploads/`): included in your regular file backup/snapshot cycle.

## Monitoring

- Tail `logs/php-error.log` (or ship it to a centralized log system) for
  application errors.
- Set up uptime monitoring against `/index.php`.
- Watch the `ai_support_log` table's `was_flagged` count as a light signal
  for abuse attempts against the support widget.

## Rollback

Because releases are separate directories with an atomic symlink swap,
rollback is: point the `current` symlink back at the previous release
directory and reload the web server. Keep the last 3–5 releases on disk
for fast rollback.
