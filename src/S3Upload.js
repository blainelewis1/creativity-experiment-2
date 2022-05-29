
  import { createS3Uploader } from "@hcikit/s3-uploader";
  import { createUpload } from "@hcikit/react";

  let uploadComponent = createUpload(
  createS3Uploader(
    "us-east-2",
    "us-east-2:aeebe413-bb45-4512-b33a-c0b1e1fbef9b",
    "creativity-experiment-1-uploadsbucket-16nn03sec0bey"
  )
  );

  export default uploadComponent;
  