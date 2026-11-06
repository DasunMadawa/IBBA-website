// cPanel/Passenger entry point for this ESM Node.js application.
// Build first, then set the application startup file to startup.cjs.
import("./dist/index.js").catch(error => {
  console.error("IBAA application startup failed:", error);
  process.exitCode = 1;
});
