export type AuthProject = {
  projectName: string;
  mode: string;
  supabaseProjectRef: string | null;
  confirmedNewDemoProject: boolean;
  localApiUrl?: string;
};

export class AuthConfigurationError extends Error {
  constructor() {
    super("새 미션 8 과제용 Supabase 연결을 준비하고 있습니다. 연결 후 회원 기능을 사용할 수 있습니다.");
    this.name = "AuthConfigurationError";
  }
}

export function validateAuthConfiguration(
  project: AuthProject,
  values: { url?: string; key?: string; siteUrl?: string; deployed?: boolean },
) {
  if (
    project.projectName !== "bluecollar-mission8-demo" ||
    !project.confirmedNewDemoProject ||
    !["local", "cloud"].includes(project.mode) ||
    !values.url || !values.key
  ) throw new AuthConfigurationError();

  let url: URL;
  let site: URL;
  try {
    url = new URL(values.url);
    site = new URL(values.siteUrl || "http://127.0.0.1:3108");
  } catch { throw new AuthConfigurationError(); }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new AuthConfigurationError();
  }
  if (
    site.username || site.password || site.search || site.hash || site.pathname !== "/" ||
    !["http://127.0.0.1:3108", "http://localhost:3108", "https://bluecollar-mission8-demo.vercel.app"].includes(site.origin)
  ) throw new AuthConfigurationError();

  if (project.mode === "cloud") {
    const ref = project.supabaseProjectRef;
    if (!ref || !/^[a-z]{20}$/.test(ref) || ["uikvezrkmwplbslayene", "nlvjybohqqkmduqcgzvj"].includes(ref) ||
      url.origin !== `https://${ref}.supabase.co` ||
      !/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(values.key)) {
      throw new AuthConfigurationError();
    }
  } else {
    let localPublicKey = /^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(values.key);
    if (!localPublicKey && /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(values.key)) {
      try {
        const payload = values.key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
        localPublicKey = JSON.parse(atob(payload)).role === "anon";
      } catch { localPublicKey = false; }
    }
    if (values.deployed || project.localApiUrl !== "http://127.0.0.1:58321" ||
      url.origin !== project.localApiUrl ||
      !localPublicKey) {
      throw new AuthConfigurationError();
    }
  }
  if (values.deployed && site.protocol !== "https:") throw new AuthConfigurationError();
  return { url: url.origin, key: values.key, siteUrl: site.origin };
}
