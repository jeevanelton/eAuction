import React from "react";

import { Spinner, Button } from "reactstrap";

const LoadingButton = () => {
  return (
    <div>
      <Button.Ripple outline>
        Loading <Spinner color="primary" size="sm" />
      </Button.Ripple>
    </div>
  );
};

export default LoadingButton;
