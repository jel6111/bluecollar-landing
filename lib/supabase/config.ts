export class DemoConfigurationError extends Error {
  constructor(message = "과제용 데이터베이스 연결 준비가 필요합니다.") {
    super(message);
    this.name = "DemoConfigurationError";
  }
}
export type DemoProjectRegistration = {
  projectName: string;
  // JSON에서 읽은 문자열이므로 아래에서 허용된 모드를 검증한다.
  mode: string;
  supabaseProjectRef: string | null;
  localApiUrl?: string;
  confirmedNewDemoProject: boolean;
};
export function validateDemoConnection(
  registration: DemoProjectRegistration,
  values: { url?: string; secret?: string; deployed?: boolean },
) {
  if (
    registration.projectName !== "bluecollar-mission6-demo" ||
    !registration.confirmedNewDemoProject ||
    !["local", "cloud"].includes(registration.mode)
  ) {
    throw new DemoConfigurationError(
      "새 과제용 Supabase 프로젝트가 아직 등록되지 않았습니다.",
    );
  }
  if (!values.url || !values.secret)
    throw new DemoConfigurationError(
      "과제용 데이터베이스 환경 변수가 아직 설정되지 않았습니다.",
    );
  let url: URL;
  try {
    url = new URL(values.url);
  } catch {
    throw new DemoConfigurationError("과제용 Supabase 주소를 확인해주세요.");
  }
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new DemoConfigurationError(
      "데이터베이스 주소가 등록한 과제 프로젝트와 일치하지 않습니다.",
    );
  }
  if (registration.mode === "local") {
    if (
      values.deployed ||
      registration.localApiUrl !== "http://127.0.0.1:56321" ||
      url.origin !== registration.localApiUrl
    ) {
      throw new DemoConfigurationError(
        "로컬 과제 DB는 지정한 포트에서만 사용할 수 있습니다. 배포에는 새 클라우드 프로젝트가 필요합니다.",
      );
    }
  } else {
    const ref = registration.supabaseProjectRef;
    if (
      !ref ||
      !/^[a-z]{20}$/.test(ref) ||
      url.protocol !== "https:" ||
      url.hostname !== `${ref}.supabase.co` ||
      url.port
    ) {
      throw new DemoConfigurationError(
        "데이터베이스 주소가 등록한 과제 프로젝트와 일치하지 않습니다.",
      );
    }
  }
  return { url: url.origin, secret: values.secret };
}
