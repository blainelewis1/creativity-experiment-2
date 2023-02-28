
  import { createS3Uploader } from "@hcikit/s3-uploader";
  import { createUpload } from "@hcikit/react";

  let uploadComponent = createUpload(
  createS3Uploader(
    "us-east-2",
    "us-east-2:b9ecdb71-7052-40e3-acba-4a05686e9984",
    "creativity-experiment-2-uploadsbucket-81uouy2gq5h6"
  )
  );

  export default uploadComponent;
  