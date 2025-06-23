import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
  className?: string | "";
}

const ContentWrapper: NextPage<Props> = ({ children, className }) => {
  return (
    <div
      className={`lg:h-[70vh] xl:h-[90vh] overflow-auto snap-y snap-mandatory ${className}`}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
