import { StackActions, NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    console.log('_navigator', _navigator)
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
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
    console.log('_navigator', _navigator)
    _navigator.dispatch(
        NavigationActions.navigate(
            {
                routeName: routeName1,
                params: {},
                action: NavigationActions.navigate({ routeName: routeName2 })
            })
    )
}

function nestedNavigate3(routeName1, routeName2, routeName3) {
    _navigator.dispatch(
        NavigationActions.navigate(
            {
                routeName: routeName1,
                params: {},
                action: NavigationActions.navigate(
                    {
                        routeName: routeName2,
                        params: {},
                        action: NavigationActions.navigate({ routeName: routeName3 })
                    })
            })
    )
}


// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    navigateReset,
    nestedNavigate,
    nestedNavigate3
};