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

function navigateReset(routeName) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName })],
        })
    )
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


// add other navigation functions that you need and export them

export default {
    navigate,
    push,
    setTopLevelNavigator,
    navigateReset,
    nestedNavigate,
    back
};