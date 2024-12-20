import { ProfileForm } from "@/components/profile/ProfileForm";

const Profil = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <ProfileForm />
    </div>
  );
};

export default Profil;