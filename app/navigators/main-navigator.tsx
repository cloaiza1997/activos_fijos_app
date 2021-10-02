/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import { CertificateListApproverScreen } from "../screens/apps/certificate/certificate-list-approver-screen"
import { CertificateViewScreen } from "../screens/apps/certificate/certificate-view-screen"
import { createStackNavigator } from "@react-navigation/stack"
import { DerecognitionListApproverScreen } from "../screens/apps/derecognition/derecognition-list-approver-screen"
import { DerecognitionViewScreen } from "../screens/apps/derecognition/derecognition-view-screen"
import { MenuScreen } from "../screens/menu/menu-screen"
import { PurchaseListApproverScreen } from "../screens/apps/purchase/purchase-list-approver-screen"
import { PurchaseViewScreen } from "../screens/apps/purchase/purchase-view-screen"
import React from "react"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  home: undefined
  purchase: undefined
  purchaseView: undefined
  certificate: undefined
  certificateView: undefined
  derecognition: undefined
  derecognitionView: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<PrimaryParamList>()

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: "transparent" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={MenuScreen} />
      <Stack.Screen name="purchase" component={PurchaseListApproverScreen} />
      <Stack.Screen name="purchaseView" component={PurchaseViewScreen} />
      <Stack.Screen name="certificate" component={CertificateListApproverScreen} />
      <Stack.Screen name="certificateView" component={CertificateViewScreen} />
      <Stack.Screen name="derecognition" component={DerecognitionListApproverScreen} />
      <Stack.Screen name="derecognitionView" component={DerecognitionViewScreen} />
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
