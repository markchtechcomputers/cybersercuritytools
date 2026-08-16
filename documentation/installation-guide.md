# Installation Guide

## Requirements

- PHP 8.1 or later, with `pdo_mysql`, `curl`, and `mbstring` extensions
- MySQL 8+ or MariaDB 10.6+
- Apache with `mod_rewrite`/`mod_headers`, or Nginx + PHP-FPM

## 1. Get the code onto your server

Copy this folder to your web server's document root (or a subdirectory
if you're hosting multiple sites).

## 2. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE meridian_cyber CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root -p -e "CREATE USER 'meridian_app'@'localhost' IDENTIFIED BY 'choose-a-strong-password'"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON meridian_cyber.* TO 'meridian_app'@'localhost'"
mysql -u root -p meridian_cyber < database/schema.sql
```

## 3. Configure environment variables

Set these on your server (via Apache `SetEnv`, a `.env` loader of your
choice, or your hosting platform's environment settings — none of these
are hard-coded in the codebase):

| Variable               | Required | Purpose                                      |
|-------------------------|----------|-----------------------------------------------|
| `APP_ENV`               | No       | `production` (default) or `development`      |
| `SITE_URL`               | Yes      | Canonical site URL, e.g. `https://yourdomain.com` |
| `DB_HOST`                | Yes      | Database host                                 |
| `DB_NAME`                | Yes      | Database name                                 |
| `DB_USER`                | Yes      | Database user                                 |
| `DB_PASS`                | Yes      | Database password                             |
| `MERIDIAN_AI_API_KEY`    | No       | Enables live AI replies in the support widget; omit to use the built-in rule-based responder |

## 4. Web server configuration

### Apache
The included `.htaccess` handles HTTPS redirection, custom error pages,
blocking sensitive directories, compression, and caching. Ensure
`AllowOverride All` is set for this directory in your vhost config.

### Nginx (PHP-FPM)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /var/www/meridian-cyber;
    index index.php;

    location ~ ^/(config|includes|database|logs)/ {
        deny all;
    }

    location / {
        try_files $uri $uri.php =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    error_page 404 /404.php;
    error_page 403 /403.php;
    error_page 500 502 503 504 /500.php;
}
```

## 5. File permissions

```bash
chmod -R 755 .
chmod -R 775 logs uploads
chown -R www-data:www-data logs uploads
```

## 6. Verify

Visit `/index.php`. Create a test account at `/auth/register.php`,
submit the contact form, and open the AI support widget to confirm the
database connection and fallback responder are working.
