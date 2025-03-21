import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md  py-4 px-6 rounded-2xl bg-[#161B22] text-white border-none ">
        <CardContent>
          <h2 className="text-2xl font-semibold ">Chalo Game Khele!</h2>
          <LoginForm type="register" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
