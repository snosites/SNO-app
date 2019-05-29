import { StackActions, NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function nestedNavigate(routeName1, routeName2) {
    _navigator.dispatch(
        NavigationActions.navigate(
            {
                routeName: routeName1,
                params: {},
                action: NavigationActions.navigate({ routeName: routeName2 })
            })
    )
}

function push(routeName, params) {
    _navigator.dispatch(
        StackActions.push({
            routeName,
            params,
        })
    );
}

function back() {
    _navigator.dispatch(
        NavigationActions.back({})
    );
}

function navigateReset(routeName, params) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            key: undefined,
            actions: [NavigationActions.navigate({ 
                routeName: routeName,
                params 
            })],
        })
    )
}



// add other navigation functions that you need and export them

export default {
    navigate,
    nestedNavigate,
    push,
    setTopLevelNavigator,
    navigateReset,
    back
};