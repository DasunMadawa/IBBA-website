// Drizzle/TiDB migration files include separators that MySQL does not parse as comments.
// utf8mb4 InnoDB permits a 3072-byte index; retain the full 1024-character legacy URL
// column but index its first 768 characters for standard MySQL compatibility.
export function prepareMysqlMigrationSql(sql) {
  return sql
    .replaceAll("--> statement-breakpoint", "\n")
    .replace("CONSTRAINT `legacy_routes_legacyPath_unique` UNIQUE(`legacyPath`)", "CONSTRAINT `legacy_routes_legacyPath_unique` UNIQUE(`legacyPath`(768))");
}
