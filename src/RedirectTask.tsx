import { CenteredNicePaper } from "@hcikit/react";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const RedirectTask: React.FC<{ url: string }> = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <CenteredNicePaper>
      <div className="text-center mx-4">
        We are redirecting you to{" "}
        <a className="text-blue-500" href={url}>
          {url}
        </a>
        <br />
        <br />
        <CircularProgress size={100} />
      </div>
    </CenteredNicePaper>
  );
};

export default RedirectTask;
