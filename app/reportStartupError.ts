const errorUtils = (
  globalThis as typeof globalThis & {
    ErrorUtils?: {
      getGlobalHandler: () => (error: Error, fatal?: boolean) => void;
      setGlobalHandler: (
        handler: (error: Error, fatal?: boolean) => void,
      ) => void;
    };
  }
).ErrorUtils;

if (__DEV__ && errorUtils) {
  const previousHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error, fatal) => {
    console.log("Original initialization error:", error.message, error.stack);
    previousHandler(error, fatal);
  });
}
