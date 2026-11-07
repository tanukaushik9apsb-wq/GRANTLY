import { GrantlyHero } from "./prisma-hero";

export default function DemoOne() {
  return (
    <GrantlyHero
      onExploreClick={() => console.log("Navigate to /explore")}
      onGetStartedClick={() => console.log("Navigate to /register")}
      onSignInClick={() => console.log("Navigate to /login")}
      onNavigate={(target) => console.log("Navigate to", target)}
    />
  );
}
