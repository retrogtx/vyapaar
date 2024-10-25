import AvatarCircles from "@/components/ui/avatar-circles";


const avatarUrls = [
  "https://avatars.githubusercontent.com/u/76801862",
  "https://avatars.githubusercontent.com/u/8079861",
  "https://avatars.githubusercontent.com/u/1024025",
  "https://avatars.githubusercontent.com/u/241138",
];

const Avatars = () => {
  return <AvatarCircles avatarUrls={avatarUrls} numPeople={99} />;
};

export default Avatars;
