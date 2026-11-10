// 1묶음에서는 환경 파일을 읽거나 외부 명령/DB를 실행하지 않는다.
console.error(
  "MISSION7_DESIGN_ONLY: 미션 7은 1묶음 설계 단계입니다. 실행·DB·파일·브라우저 검사 명령은 차단했습니다. docs/mission7-isolation.md를 확인해주세요.",
);
process.exitCode = 42;
