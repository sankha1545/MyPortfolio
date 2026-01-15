import Link from "next/link";

import {

  RiGithubLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";

export const socialData = [

  {
    name: "Github",
    link: "https://github.com/sankha1545",
    Icon: RiGithubLine,
  },
  {
    name: "linkedIn",
    link: "https://www.linkedin.com/in/sankha-subhra-das-625ab6201/",
    Icon: RiLinkedinBoxLine,
  },
];

const Socials = () => {
  return (
    <div className="flex items-center text-lg gap-x-5">
      {socialData.map((social, i) => (
        <Link
          key={i}
          title={social.name}
          href={social.link}
          target="_blank"
          rel="noreferrer noopener"
          className={`${
            social.name === "Github" || "LinkedIn"
              ? "bg-accent rounded-full p-[5px] hover:text-white"
              : "hover:text-accent"
          } transition-all duration-300`}
        >
          <social.Icon aria-hidden />
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
