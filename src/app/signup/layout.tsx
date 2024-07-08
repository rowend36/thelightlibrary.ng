import LoginLayout from "../login/layout";

export default function SignUpLayout(props: any) {
  return <LoginLayout {...props} isSignUp={true} />;
}
