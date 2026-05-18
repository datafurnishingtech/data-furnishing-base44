import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.resolve(root, "src");

const PAGE_BRIDGES = {
  AuthLogin: "AuthLogin.supabase.jsx",
  AuthRegister: "AuthRegister.supabase.jsx",
  AuthForgotPassword: "AuthForgotPassword.supabase.jsx",
  Overview: "Overview.supabase.jsx",
  Furnishers: "Furnishers.supabase.jsx",
  Tradelines: "Tradelines.supabase.jsx",
  BureauCoverage: "BureauCoverage.supabase.jsx",
};

const COMPONENT_BRIDGES = {
  "components/furnishers/FurnisherDetailPanel": "components/furnishers/FurnisherDetailPanel.supabase.jsx",
  "components/overview/FurnisherCoverageHeatmap": "components/overview/FurnisherCoverageHeatmap.supabase.jsx",
  "components/layout/Sidebar": "components/layout/Sidebar.supabase.jsx",
};

function bridgePath(relativePath) {
  return path.join(src, "bridges", relativePath);
}

function matchPageName(sourceOrId) {
  const normalized = String(sourceOrId).split("?")[0].replace(/\\/g, "/");
  for (const pageName of Object.keys(PAGE_BRIDGES)) {
    if (
      normalized.endsWith(`/src/pages/${pageName}.jsx`) ||
      normalized === `./pages/${pageName}` ||
      normalized === `./pages/${pageName}.jsx` ||
      normalized === `pages/${pageName}` ||
      normalized === `pages/${pageName}.jsx` ||
      normalized.endsWith(`/pages/${pageName}`) ||
      normalized.endsWith(`/pages/${pageName}.jsx`)
    ) {
      return pageName;
    }
  }
  return null;
}

function matchComponentBridge(sourceOrId) {
  const normalized = String(sourceOrId).split("?")[0].replace(/\\/g, "/");
  for (const [componentPath, bridgeFile] of Object.entries(COMPONENT_BRIDGES)) {
    if (
      normalized.endsWith(`/src/${componentPath}.jsx`) ||
      normalized.endsWith(`/${componentPath}.jsx`) ||
      normalized === `./${componentPath}` ||
      normalized === `./${componentPath}.jsx`
    ) {
      return bridgeFile;
    }
  }
  return null;
}

export function supabaseIntegrationPlugin() {
  const clientBridge = path.join(src, "api/base44Client.supabase.js");
  const authBridge = path.join(src, "lib/auth/AuthContext.supabase.jsx");
  const appBridge = path.join(src, "bridges/App.supabase.jsx");

  const alias = {
    "@/lib/AuthContext": authBridge,
    "@/lib/AuthContext.jsx": authBridge,
    "@/api/base44Client": clientBridge,
    "@/api/base44Client.js": clientBridge,
    [path.join(src, "api/base44Client.js")]: clientBridge,
    [path.join(src, "lib/AuthContext.jsx")]: authBridge,
    [path.join(src, "App.jsx")]: appBridge,
    ...Object.fromEntries(
      Object.keys(PAGE_BRIDGES).map((name) => [
        path.join(src, `pages/${name}.jsx`),
        bridgePath(`pages/${PAGE_BRIDGES[name]}`),
      ])
    ),
  };

  return {
    name: "supabase-integration",
    enforce: "pre",
    config() {
      return { resolve: { alias } };
    },
    resolveId(source) {
      const pageName = matchPageName(source);
      if (pageName) return bridgePath(`pages/${PAGE_BRIDGES[pageName]}`);
      const componentBridge = matchComponentBridge(source);
      if (componentBridge) return bridgePath(componentBridge);
      return null;
    },
    load(id) {
      const clean = id.split("?")[0].replace(/\\/g, "/");
      if (clean.endsWith("/src/api/base44Client.js")) {
        return fs.readFileSync(clientBridge, "utf-8");
      }
      if (clean.endsWith("/src/lib/AuthContext.jsx")) {
        return fs.readFileSync(authBridge, "utf-8");
      }
      if (clean.endsWith("/src/App.jsx")) {
        return fs.readFileSync(appBridge, "utf-8");
      }
      const pageName = matchPageName(clean);
      if (pageName) {
        const bridge = bridgePath(`pages/${PAGE_BRIDGES[pageName]}`);
        if (fs.existsSync(bridge)) return fs.readFileSync(bridge, "utf-8");
      }
      const componentBridge = matchComponentBridge(clean);
      if (componentBridge) {
        const bridge = bridgePath(componentBridge);
        if (fs.existsSync(bridge)) return fs.readFileSync(bridge, "utf-8");
      }
      return null;
    },
    transformIndexHtml(html) {
      return html.replace('src="/src/main.jsx"', 'src="/src/main-supabase.jsx"');
    },
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer.address();
        const port = typeof addr === "object" && addr ? addr.port : 5173;
        const host = server.config.server.host || "localhost";
        console.log("");
        console.log("  \x1b[32m✓\x1b[0m Data Furnishing dev server is running");
        console.log(`  \x1b[36m→\x1b[0m Local:   http://${host}:${port}/`);
        console.log(`  \x1b[36m→\x1b[0m Login:   http://${host}:${port}/auth-login`);
        console.log("  \x1b[32m✓\x1b[0m Supabase: auth, registry, tradelines, bureau, admin dashboard");
        console.log("");
      });
    },
  };
}
