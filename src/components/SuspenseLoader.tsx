import { Suspense, ComponentType } from "react";
import Loader from "./Loader";

const SuspenseLoader =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );

export default SuspenseLoader;
