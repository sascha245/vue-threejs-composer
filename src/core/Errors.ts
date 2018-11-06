export const HandlerMapErrors = {
  ALREADY_EXISTS: (name: string) => {
    return {
      entry: name,
      code: "handler_already_exists",
      message: "An handler with the given name already exists"
    };
  }
};
export const AssetMapErrors = {
  ALREADY_EXISTS: (name: string) => {
    return {
      entry: name,
      code: "asset_already_exists",
      message: "An asset with the given name already exists"
    };
  }
};
