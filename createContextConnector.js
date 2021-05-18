import React from "react";

/**
 * Create a connector to map Context value to component. The idea is similar to connect in Redux and Formik.
 * @return {<TContext extends import('react').Context<TState>, TState>(context: TContext) => (mapContextToProps: <T>(context: TContext, props: any) => T) => (Component: JSX.Element) => (props: object) => JSX.Element}
 * @example
 * // Assume you have a context type is instantiate as follow:
 * const MyContext = React.createContext();
 *
 * // and a component
 * function MyComponent({ value, onChange }) {
 *   // code to render here
 * }
 *
 * // Create a connector
 * const connectToContext = createContextConnector(MyContext);
 *
 * // And then connect to your component
 * const mapContextToProps = (context) => ({
 *   value: context.valueInContext,
 *   onChange: () => {
 *     // Invoking multiple context methods here!
 *     // This is known as thunk in Redux 😎.
 *     context.method1();
 *     context.method2();
 *   }
 * });
 *
 * // Create a connected component
 * const ConnectedMyComponent = connectToContext(mapContextToProps)(MyComponent);
 * @todo This utility is good enough because it makes the code is clean and structure. Perhaps, I think
 * there are some issues are related to performance because the context values aren't memorized. But they
 * are absolutely resolved by memo or 3rd party libs. This tasks is important but not urgent 😁.
 */

const createContextConnector = (Context) => (mapContextToProps) => (
  Component
) => (props) => (
  <Context.Consumer>
    {(contextValue) => {
      let connectedProps = null;

      if (mapContextToProps) {
        connectedProps = mapContextToProps(contextValue, props);
      }

      return <Component {...props} {...connectedProps} />;
    }}
  </Context.Consumer>
);

export default createContextConnector;
