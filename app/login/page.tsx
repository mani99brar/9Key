import AuthForm from "../auth-form";

export default function Home() {
  return (
    <div className="bg-black h-screen w-screen flex flex-col items-center justify-center">
      <div className="fixed top-4 lg:left-6 text-lg bg-black text-white px-4 py-2 w-[212px] text-center rounded"><strong className="text-xl font-mono">zkKey</strong> | Login</div>
      <AuthForm />
    </div>
  );
}