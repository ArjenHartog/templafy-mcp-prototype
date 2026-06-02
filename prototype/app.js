const ASSETS = {
  logo: "../assets/templafy.svg",
  themes: "../assets/templafy-themes.png",
  generating: "../assets/templafy-generation-inprogress.png",
  final: "../assets/templafy-download-final-result.png",
};

const state = {
  screen: "directory",
  scenario: "mcpEnabled",
  email: "jane@acme.com",
  selectedTenant: "Acme",
  consentNeeded: false,
};

const scenarios = {
  mcpEnabled: {
    label: "Existing customer",
    email: "jane@acme.com",
    tenant: "Acme",
    tenants: ["Acme"],
    authMethod: "sso",
    note: "MCP is already enabled for this Templafy tenant.",
    outcome: "mcpEnabled",
    agentsActive: true,
    mcpEnabled: true,
  },
  multiTenant: {
    label: "Rare: multiple tenants",
    email: "admin@northstar.example",
    tenant: "Northstar",
    tenants: ["Northstar", "Delta Team"],
    authMethod: "sso",
    note: "Tenant selection is only shown when one email can access more than one tenant.",
    outcome: "mcpEnabled",
    agentsActive: true,
    mcpEnabled: true,
  },
  emailAuth: {
    label: "Existing email-auth user",
    email: "alex@evergreen.example",
    tenant: "Evergreen",
    tenants: ["Evergreen"],
    authMethod: "email",
    note: "The user signs in with a Templafy email/password authentication method.",
    outcome: "mcpEnabled",
    agentsActive: true,
    mcpEnabled: true,
  },
  agentsActive: {
    label: "Agents active, consent present",
    email: "alex@northwind.com",
    tenant: "Northwind",
    tenants: ["Northwind"],
    authMethod: "sso",
    note: "Document Agents are active. Existing consent allows MCP to continue.",
    outcome: "agentsActive",
    agentsActive: true,
    mcpEnabled: false,
    consentNeeded: false,
  },
  agentsConsent: {
    label: "Agents active, consent needed",
    email: "maria@contoso.com",
    tenant: "Contoso",
    tenants: ["Contoso"],
    authMethod: "sso",
    note: "Document Agents are active, but tenant consent is still required.",
    outcome: "agentsActive",
    agentsActive: true,
    mcpEnabled: false,
    consentNeeded: true,
  },
  noAgents: {
    label: "Existing user, no agents",
    email: "sam@paperplane.example",
    tenant: "Freemium tenant",
    tenants: ["Freemium tenant"],
    authMethod: "email",
    note: "No MCP-enabled tenant or Document Agents were found, so the user is routed to the free product flow.",
    outcome: "noAgents",
    agentsActive: false,
    mcpEnabled: false,
  },
  unknown: {
    label: "Unknown user",
    email: "taylor@brightlane.example",
    tenant: "Freemium tenant",
    tenants: [],
    authMethod: "signup",
    note: "No existing customer tenant match after duplicate checks.",
    outcome: "unknown",
    agentsActive: false,
    mcpEnabled: false,
  },
};

const scenarioShortLabels = {
  mcpEnabled: "Existing customer",
  multiTenant: "Rare: tenants",
  emailAuth: "Email auth",
  agentsActive: "Agents ok",
  agentsConsent: "Rare: consent",
  noAgents: "No agents",
  unknown: "Free product",
};

const app = document.querySelector("#app");
const validScreens = new Set([
  "directory",
  "detail",
  "authChoice",
  "selectTenant",
  "loginMethod",
  "login",
  "sso",
  "tenantCheck",
  "signup",
  "inbox",
  "profile",
  "consent",
  "connected",
  "forgot",
]);

function setScreen(screen, patch = {}) {
  Object.assign(state, patch, { screen });
  if (validScreens.has(screen)) {
    window.location.hash = screen;
  }
  render();
}

function applyScenario(id) {
  const scenario = scenarios[id];
  Object.assign(state, {
    scenario: id,
    email: scenario.email,
    selectedTenant: scenario.tenant,
    consentNeeded: !!scenario.consentNeeded,
  });
}

function setScenario(id) {
  applyScenario(id);
  render();
}

function logoTile(size = 46) {
  return `
    <span class="logo-tile" style="width:${size}px;height:${size}px">
      <img src="${ASSETS.logo}" alt="Templafy" />
    </span>
  `;
}

function directoryScreen() {
  app.innerHTML = `
    <main class="screen claude-bg">
      <section class="app-frame">
        ${sidebar("Connectors")}
        <div class="main">
          <div class="topbar">
            <h1 class="title">Directory</h1>
            <div class="search">Search connectors...</div>
          </div>
          <div class="connector-grid">
            <button class="connector-card primary" data-action="detail">
              ${logoTile()}
              <span>
                <h2>Templafy</h2>
                <p>Create trusted documents and presentations directly from Claude.</p>
              </span>
              <span class="plus">+</span>
            </button>
            ${connector("Productivity suite", "Access business documents, mail, and collaboration data.")}
            ${connector("Design tool", "Generate diagrams and better code from design context.")}
            ${connector("Knowledge base", "Search and update shared knowledge across tools.")}
            ${connector("Cloud storage", "Search, read, and upload files instantly.")}
            ${connector("Team chat", "Send messages and fetch shared conversation context.")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function connector(name, description) {
  return `
    <button class="connector-card" type="button">
      <span class="logo-tile"><strong>${name.slice(0, 1)}</strong></span>
      <span>
        <h3>${name}</h3>
        <p>${description}</p>
      </span>
      <span class="plus">+</span>
    </button>
  `;
}

function sidebar(active) {
  return `
    <aside class="sidebar">
      <p class="sidebar-title">Directory</p>
      <button class="side-item">Skills</button>
      <button class="side-item ${active === "Connectors" ? "active" : ""}">Connectors</button>
      <button class="side-item">Plugins</button>
    </aside>
  `;
}

function detailScreen() {
  app.innerHTML = `
    <main class="screen claude-bg">
      <section class="app-frame">
        ${sidebar("Connectors")}
        <div class="main">
          <button class="button-ghost" data-action="directory">Back</button>
          <div class="detail-header">
            ${logoTile(58)}
            <div>
              <h1>Templafy</h1>
              <p>Generate trusted documents and presentations directly from Claude</p>
            </div>
            <button class="button dark" data-action="authChoice">Connect</button>
          </div>
          <div class="visual-row">
            <article class="visual-card"><img src="${ASSETS.themes}" alt="Templafy themes" /></article>
            <article class="visual-card"><img src="${ASSETS.generating}" alt="Templafy generation in progress" /></article>
            <article class="visual-card"><img src="${ASSETS.final}" alt="Templafy generated result" /></article>
          </div>
          <div class="copy-block">
            <p>Browse approved themes, generate branded presentations, and download polished business documents from the same connector. Templafy keeps AI output aligned with tenant permissions and company content standards.</p>
          </div>
          <div class="tool-pills">
            <span class="pill">list-themes</span>
            <span class="pill">generate-document</span>
            <span class="pill">generate-ai-presentation</span>
            <span class="pill">download-ppt</span>
            <span class="pill">download-pdf</span>
          </div>
        </div>
      </section>
    </main>
  `;
}

function postIts(notes = []) {
  if (!notes.length) return "";
  return `
    <aside class="postit-board" aria-label="Flow notes">
      ${notes
        .map(
          (note) => `
            <article class="postit">
              <h2>${note.title}</h2>
              <div class="postit-body">${note.body}</div>
            </article>
          `,
        )
        .join("")}
    </aside>
  `;
}

function authShell(content, notes = []) {
  app.innerHTML = `
    <main class="auth-screen">
      <section class="prototype-stage">
        <section class="auth-stack">
          <div class="wordmark">
            <span class="mark"><img src="${ASSETS.logo}" alt="" /></span>
            <span>templafy</span>
          </div>
          ${content}
        </section>
        ${postIts(notes)}
      </section>
    </main>
  `;
}

function authChoiceScreen() {
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Access Templafy</h1>
      <p class="auth-subtitle">Enter your email address to continue.</p>
      <form class="form" data-form="identify">
        <div class="field">
          <label for="identify-email">Email address</label>
          <input id="identify-email" name="email" type="email" value="${state.email}" placeholder="Enter your email address" autocomplete="email" />
        </div>
        <button class="button" type="submit">Access Templafy</button>
      </form>
      <div class="auth-divider"></div>
      <div class="signup-nudge">
        <div>
          <h2>New to Templafy?</h2>
          <p>Try the free PowerPoint agent and create your first deck in minutes.</p>
        </div>
        <button class="button-secondary" type="button" data-action="signup">Start free product</button>
      </div>
    </div>
  `, [
    {
      title: "What happens here",
      body: "This mirrors the real Templafy identification page: email first, then the backend decides which tenant and login method applies.",
    },
    {
      title: "Prototype paths",
      body: `<p>Most users are either an existing customer or a new free-product user. Rare branches are labeled.</p><div class="scenario-buttons">
        ${Object.entries(scenarios)
          .map(([id]) => `<button data-scenario="${id}">${scenarioShortLabels[id]}</button>`)
          .join("")}
      </div>`,
    },
  ]);
}

function selectTenantScreen() {
  const scenario = scenarios[state.scenario];
  const tenants = scenario.tenants?.length ? scenario.tenants : [scenario.tenant];
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Select account</h1>
      <p class="auth-subtitle">Click on the account you want to authenticate to.</p>
      <div class="tenant-list">
        ${tenants
          .map(
            (tenant) => `
              <button class="tenant-card" type="button" data-tenant="${tenant}">
                <span>
                  <strong>${tenant}</strong>
                  <small>https://${tenant.toLowerCase().replaceAll(" ", "")}.templafy.com</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="link-row" style="margin-top: 20px; justify-content: center;">
        <button class="link" type="button" data-action="authChoice">Sign in with another account</button>
      </div>
    </div>
  `, [
    {
      title: "Rare branch",
      body: "Most users never see tenant selection. It only appears when the same email can access more than one Templafy tenant.",
    },
  ]);
}

function loginMethodScreen() {
  const scenario = scenarios[state.scenario];
  const selectedTenant = state.selectedTenant || scenario.tenant;
  const showSso = scenario.authMethod === "sso" || scenario.authMethod === "both";
  const showEmail = scenario.authMethod === "email" || scenario.authMethod === "both";
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Select your login method</h1>
      <p class="auth-subtitle">You will be asked to log in in the next step.</p>
      <div class="method-list">
        ${
          showSso
            ? `<button class="method-card" type="button" data-action="sso">
                <span class="method-icon">S</span>
                <span>
                  <strong>${selectedTenant} SSO</strong>
                  <small>Single Sign On</small>
                </span>
              </button>`
            : ""
        }
        ${
          showEmail
            ? `<button class="method-card" type="button" data-action="login">
                <span class="method-icon">E</span>
                <span>
                  <strong>Email login</strong>
                  <small>Email</small>
                </span>
              </button>`
            : ""
        }
      </div>
      <div class="link-row" style="margin-top: 20px; justify-content: center;">
        <button class="link" type="button" data-action="authChoice">Sign in with another account</button>
      </div>
    </div>
  `, [
    {
      title: "After email",
      body: "Password or SSO is never shown first. It appears only after the email has resolved to a tenant and available auth method.",
    },
  ]);
}

function loginScreen() {
  const scenario = scenarios[state.scenario];
  const selectedTenant = state.selectedTenant || scenario.tenant;
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Sign in</h1>
      <p class="auth-subtitle">Continue to ${selectedTenant} with email and password.</p>
      <form class="form" data-form="login">
        <div class="field">
          <label for="email">Email address</label>
          <input id="email" name="email" type="email" value="${state.email}" placeholder="Enter your email address" readonly />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" value="password" />
        </div>
        <div class="link-row">
          <button class="link" type="button" data-action="forgot">Forgot your password?</button>
          <button class="link subtle" type="button" data-action="sso">Continue with Single Sign On</button>
        </div>
        <button class="button" type="submit">Access Templafy</button>
      </form>
      <div class="link-row" style="margin-top: 20px; justify-content: center;">
        <button class="link" type="button" data-action="authChoice">Sign in with another account</button>
      </div>
    </div>
  `);
}

function ssoScreen() {
  const scenario = scenarios[state.scenario];
  const selectedTenant = state.selectedTenant || scenario.tenant;
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Continue with Single Sign On</h1>
      <p class="auth-subtitle">Use your organization account to continue to ${selectedTenant}.</p>
      <form class="form" data-form="sso">
        <div class="field">
          <label for="sso-email">Email address</label>
          <input id="sso-email" type="email" value="${state.email || scenario.email}" placeholder="Enter your email address" readonly />
        </div>
        <button class="button" type="submit">Access Templafy</button>
      </form>
      <div class="link-row" style="margin-top: 20px;">
        <button class="link subtle" type="button" data-action="loginMethod">Choose another login method</button>
        <button class="link" type="button" data-action="authChoice">Sign in with another account</button>
      </div>
    </div>
  `);
}

function signupScreen() {
  const email = state.scenario === "unknown" ? state.email : "";
  app.innerHTML = `
    <main class="freemium-screen">
      <section class="freemium-shell">
        <div class="freemium-hero">
          <div class="freemium-logo">
            <span class="logo-tile"><img src="${ASSETS.logo}" alt="Templafy" /></span>
            <strong>templafy</strong>
          </div>
          <h1>Create your next PowerPoint in minutes</h1>
          <div class="hero-stat">
            <strong>105 125 m</strong>
            <span>documents created yearly with Templafy</span>
          </div>
          <div class="hero-preview">
            <img src="${ASSETS.final}" alt="Generated Templafy presentation" />
          </div>
        </div>
        <aside class="free-product-card">
          <h2>Go to free product</h2>
          <form class="form" data-form="signup">
            <div class="field">
              <label for="signup-email">Email *</label>
              <input id="signup-email" type="email" value="${email}" placeholder="Enter your email address" />
            </div>
            <button class="button" type="submit">Continue with email</button>
            <div class="provider-grid">
              <button class="button-secondary" type="button" data-action="providerSignup">Continue with Microsoft</button>
              <button class="button-secondary" type="button" data-action="providerSignup">Continue with Google</button>
            </div>
            <label class="terms-check">
              <input type="checkbox" checked />
              <span>I accept the Terms of Service and Privacy Policy. I understand that I consent to receive marketing communications, and that I can unsubscribe at any time. *</span>
            </label>
          </form>
          <div class="link-row" style="margin-top: 18px; justify-content: center;">
            <span>Already have an account?</span>
            <button class="link" type="button" data-action="authChoice">Access Templafy</button>
          </div>
        </aside>
      </section>
    </main>
  `;
}

function tenantCheckScreen() {
  const scenario = scenarios[state.scenario];
  const selectedTenant = state.selectedTenant || scenario.tenant;
  const outcome = tenantCheckOutcome(scenario);

  authShell(`
    <div class="auth-card narrow resolve-card">
      <div class="quiet-kicker">${outcome.kicker}</div>
      <h1 class="auth-title">${outcome.title}</h1>
      <p class="auth-subtitle">${outcome.copy}</p>
      <div class="connection-summary">
        <span>${logoTile(42)}</span>
        <span>
          <strong>${selectedTenant}</strong>
          <small>${state.email}</small>
        </span>
      </div>
      <div class="footer-actions stacked">
        <button class="button" data-action="${outcome.action}">${outcome.cta}</button>
        <button class="button-secondary" data-action="authChoice">Use another email</button>
      </div>
    </div>
  `, tenantCheckNotes(scenario));
}

function tenantCheckOutcome(scenario) {
  if (scenario.mcpEnabled) {
    return {
      kicker: "Existing Templafy customer",
      title: "Your Templafy tenant is ready",
      copy: "Continue with your existing Templafy tenant.",
      action: "connected",
      cta: "Continue",
    };
  }

  if (scenario.agentsActive) {
    return {
      kicker: "Templafy Connector",
      title: scenario.consentNeeded ? "Review access" : "Your organization is ready",
      copy: scenario.consentNeeded
        ? "Review access to complete the connection."
        : "Continue to Claude. We will also notify the Templafy customer team so they can support your rollout.",
      action: scenario.consentNeeded ? "consent" : "connected",
      cta: scenario.consentNeeded ? "Review access" : "Continue",
    };
  }

  return {
    kicker: "Free Templafy product",
    title: "Start with the free PowerPoint agent",
    copy: "Try Templafy with this email and create your first PowerPoint in minutes.",
    action: "signup",
    cta: "Go to free product",
  };
}

function tenantCheckNotes(scenario) {
  const notes = [
    {
      title: "Backend resolver",
      body: "After the user signs in, the resolver checks the verified email against existing tenants before any signup flow can create a new tenant.",
    },
  ];

  if (scenario.mcpEnabled) {
    notes.push({
      title: "Default customer path",
      body: "If MCP is enabled on the existing tenant, the user continues without setup or consent screens.",
    });
  } else if (scenario.agentsActive && !scenario.consentNeeded) {
    notes.push({
      title: "Agents active",
      body: "If Document Agents are active and consent is already present, the user continues. A CS notification is sent silently in the background.",
    });
  } else if (scenario.agentsActive && scenario.consentNeeded) {
    notes.push({
      title: "Consent only if needed",
      body: "Consent is an exception path. It is shown only when Document Agents are active but connector consent has not been granted yet.",
    });
  } else {
    notes.push({
      title: "Free-product route",
      body: "If no MCP-enabled tenant or Document Agents tenant is found, the user can start the freemium signup with the same verified email.",
    });
  }

  notes.push({
    title: "Preview outcomes",
    body: `<div class="scenario-buttons">
      ${Object.entries(scenarios)
        .map(([id]) => `<button data-scenario="${id}">${scenarioShortLabels[id]}</button>`)
        .join("")}
    </div>`,
  });

  return notes;
}

function inboxScreen() {
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Check your inbox</h1>
      <p class="auth-subtitle">We have sent a secure link to ${state.email}. Click the link to continue setting up the free product.</p>
      <div class="footer-actions">
        <button class="button" data-action="verifyEmail">Open verification link</button>
        <button class="button-secondary" data-action="signup">Resend link</button>
      </div>
    </div>
  `, [
    {
      title: "Signup guard",
      body: "No freemium tenant is created before the email is verified. The resolver runs duplicate checks again after verification to avoid typo-driven signups.",
    },
  ]);
}

function profileScreen() {
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">You're ready to start</h1>
      <p class="auth-subtitle">Your email has been verified. Continue to the free product.</p>
      <button class="button wide" data-action="verifyEmail">Continue</button>
    </div>
  `, [
    {
      title: "Email-only signup",
      body: "No extra profile fields are required for free-product signup. Verification plus final duplicate checks are enough to create the freemium tenant.",
    },
  ]);
}

function resolveScreen() {
  const scenario = scenarios[state.scenario];
  if (scenario.outcome === "unknown") {
    setScreen("inbox");
    return;
  }

  if (scenario.outcome === "noAgents") {
    setScreen("signup", { scenario: "unknown", selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
    return;
  }

  if (scenario.outcome === "agentsActive" && state.consentNeeded) {
    setScreen("consent");
    return;
  }

  setScreen("connected");
}

function chooseScenarioFromEmail(email) {
  const normalized = (email || "").trim().toLowerCase();
  const exactMatch = Object.entries(scenarios).find(
    ([, scenario]) => scenario.email.toLowerCase() === normalized,
  );

  if (exactMatch) {
    const [id, scenario] = exactMatch;
    Object.assign(state, {
      scenario: id,
      email: normalized,
      selectedTenant: scenario.tenant,
      consentNeeded: !!scenario.consentNeeded,
    });
    return scenario;
  }

  if (normalized.includes("newco") || normalized.endsWith(".example")) {
    Object.assign(state, {
      scenario: "unknown",
      email: normalized,
      selectedTenant: scenarios.unknown.tenant,
      consentNeeded: false,
    });
    return scenarios.unknown;
  }

  Object.assign(state, {
    email: normalized || state.email,
    scenario: "unknown",
    selectedTenant: scenarios.unknown.tenant,
    consentNeeded: false,
  });
  return scenarios.unknown;
}

function consentScreen() {
  const scenario = scenarios[state.scenario];
  authShell(`
    <div class="auth-card narrow consent-card">
      <div class="quiet-kicker">Templafy Connector</div>
      <h1 class="auth-title">Review access</h1>
      <p class="auth-subtitle">Review what the Templafy Connector can access before continuing.</p>
      <div class="permission-list">
        <div>
          <strong>Create branded documents and presentations</strong>
          <span>Use approved Templafy content and templates for this tenant.</span>
        </div>
        <div>
          <strong>Read available themes and assets</strong>
          <span>Show only content this user can access in Templafy.</span>
        </div>
      </div>
      <div class="footer-actions stacked">
        <button class="button" data-action="grantConsent">Allow access</button>
        <button class="button-secondary" data-action="login">Back</button>
      </div>
    </div>
  `, [
    {
      title: "Rare branch",
      body: "This screen is not shown when MCP is already enabled. It appears only if Document Agents are active and tenant consent is still missing.",
    },
    {
      title: "After consent",
      body: "The connector continues with the existing tenant. Templafy CS is notified in the background so they can support the organization.",
    },
  ]);
}

function connectedScreen() {
  const scenario = scenarios[state.scenario];
  const email = state.email || scenario.email;
  const selectedTenant = state.selectedTenant || scenario.tenant;
  const isAgents = scenario.outcome === "agentsActive";
  const connectedCopy = isAgents
    ? "Taking you back to Claude. We will also notify the Templafy customer team so they can support your organization."
    : "Taking you back to Claude. You can close this tab.";
  const notes = [
    {
      title: "Resolved tenant",
      body: `<p><strong>${selectedTenant}</strong><br>${email}</p><p>${scenario.note}</p>`,
    },
  ];

  if (isAgents) {
    notes.push({
      title: "CS notification",
      body: `Sent in the background with tenant, user, source = Claude connector, and consent status = ${state.consentNeeded ? "granted" : "already present"}.`,
    });
  }

  if (scenario.outcome === "unknown") {
    notes.push({
      title: "Freemium tenant",
      body: "Verified email and duplicate checks are complete, so the freemium tenant is created idempotently.",
    });
  }

  authShell(`
    <div class="auth-card narrow connected-card">
      <span class="connected-mark">${logoTile(58)}</span>
      <h1 class="auth-title">Connected</h1>
      <p class="auth-subtitle">${connectedCopy}</p>
      <button class="button dark wide" data-action="detail">Open desktop app</button>
      <button class="link standalone" type="button" data-action="authChoice">Try another path</button>
    </div>
  `, notes);
}

function forgotScreen() {
  authShell(`
    <div class="auth-card narrow">
      <h1 class="auth-title">Request a new password</h1>
      <p class="auth-subtitle">Enter your email address and we will send password reset instructions if the account exists.</p>
      <form class="form" data-form="forgot">
        <div class="field">
          <label>Email address</label>
          <input type="email" value="${state.email}" placeholder="Enter your email address" />
        </div>
        <button class="button" type="submit">Request new password</button>
      </form>
      <div class="footer-actions">
        <button class="button-secondary" data-action="login">Go back to login</button>
      </div>
    </div>
  `);
}

function render() {
  const screens = {
    directory: directoryScreen,
    detail: detailScreen,
    authChoice: authChoiceScreen,
    selectTenant: selectTenantScreen,
    loginMethod: loginMethodScreen,
    login: loginScreen,
    sso: ssoScreen,
    tenantCheck: tenantCheckScreen,
    signup: signupScreen,
    inbox: inboxScreen,
    profile: profileScreen,
    consent: consentScreen,
    connected: connectedScreen,
    forgot: forgotScreen,
  };
  (screens[state.screen] || screens.directory)();
}

document.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    setScenario(scenarioButton.dataset.scenario);
    return;
  }

  const tenantButton = event.target.closest("[data-tenant]");
  if (tenantButton) {
    setScreen("loginMethod", { selectedTenant: tenantButton.dataset.tenant });
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "directory") setScreen("directory");
  if (action === "detail") setScreen("detail");
  if (action === "authChoice") setScreen("authChoice");
  if (action === "selectTenant") setScreen("selectTenant");
  if (action === "loginMethod") setScreen("loginMethod");
  if (action === "login") setScreen("login");
  if (action === "sso") setScreen("sso");
  if (action === "tenantCheck") setScreen("tenantCheck");
  if (action === "signup") setScreen("signup", { scenario: "unknown", email: state.email || scenarios.unknown.email, selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
  if (action === "providerSignup") setScreen("inbox", { scenario: "unknown", email: state.email || scenarios.unknown.email, selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
  if (action === "forgot") setScreen("forgot");
  if (action === "profile") setScreen("profile", { scenario: "unknown", email: state.email || scenarios.unknown.email, selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
  if (action === "verifyEmail") setScreen("connected", { scenario: "unknown", selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
  if (action === "connected") setScreen("connected");
  if (action === "grantConsent") setScreen("connected", { consentNeeded: true });
  if (action === "consent") setScreen("consent");
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const formType = form.dataset.form;

  if (formType === "signup") {
    const input = form.querySelector("input");
    state.email = input.value || scenarios.unknown.email;
    state.scenario = "unknown";
    state.selectedTenant = scenarios.unknown.tenant;
    state.consentNeeded = false;
    setScreen("inbox");
    return;
  }

  if (formType === "forgot") {
    setScreen("login");
    return;
  }

  if (formType === "profile") {
    setScreen("connected", { scenario: "unknown", selectedTenant: scenarios.unknown.tenant, consentNeeded: false });
    return;
  }

  const input = form.querySelector("input[type='email']");
  if (input?.value) {
    state.email = input.value;
  }

  if (formType === "identify") {
    const scenario = chooseScenarioFromEmail(state.email);
    if (scenario.outcome === "unknown") {
      setScreen("signup", { scenario: "unknown" });
      return;
    }
    if (scenario.tenants && scenario.tenants.length > 1) {
      setScreen("selectTenant");
      return;
    }
    setScreen("loginMethod");
    return;
  }

  if (formType === "login" || formType === "sso") {
    resolveScreen();
    return;
  }

  resolveScreen();
});

const initialScreen = window.location.hash.replace("#", "");
if (validScreens.has(initialScreen)) {
  state.screen = initialScreen;
  const initialScenarioByScreen = {
    selectTenant: "multiTenant",
    consent: "agentsConsent",
    signup: "unknown",
    inbox: "unknown",
    profile: "unknown",
  };
  if (initialScenarioByScreen[initialScreen]) {
    applyScenario(initialScenarioByScreen[initialScreen]);
  }
}

render();
