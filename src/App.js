import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Switch} from 'react-router-dom'  
import { ThemeProvider } from '@material-ui/styles';

import { default as RouteWithLayout } from './components/RouteWithLayout';
import { Main as MainLayout } from './layouts';

import {
  SignIn as SignInView,
  ServiceRequest as ServiceRequestView,
  User as UserView,
  Account as AccountView,
  Customer as CustomerView,
  Racket as RacketView,
  String as StringView
} from './pages';

import theme from './theme';
import store from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import './i18n'

function App() {
  return ( 
    <ThemeProvider theme={theme}>
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <Suspense fallback={null}>
            <Router>  
              <Switch>
                <RouteWithLayout
                  component={ServiceRequestView}
                  exact
                  layout={MainLayout}
                  path="/servicerequest"
                />  
                <RouteWithLayout
                  component={UserView}
                  exact
                  layout={MainLayout}
                  path="/users"
                />
                <RouteWithLayout
                  component={AccountView}
                  exact
                  layout={MainLayout}
                  path="/account"
                />
                <RouteWithLayout
                  component={CustomerView}
                  exact
                  layout={MainLayout}
                  path="/customer"
                />  
                <RouteWithLayout
                  component={RacketView}
                  exact
                  layout={MainLayout}
                  path="/racket"
                />  
                <RouteWithLayout
                  component={StringView}
                  exact
                  layout={MainLayout}
                  path="/string"
                />  
                <Route path="/" key={1} component={SignInView} />
              </Switch>
            </Router>
          </Suspense>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
