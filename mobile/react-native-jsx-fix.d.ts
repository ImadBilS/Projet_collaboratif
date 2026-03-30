import type * as React from "react";
import type { ImageProps } from "react-native/Libraries/Image/Image";
import type { PressableProps } from "react-native/Libraries/Components/Pressable/Pressable";
import type { ScrollViewProps } from "react-native/Libraries/Components/ScrollView/ScrollView";
import type { SafeAreaViewProps } from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import type { TextProps } from "react-native/Libraries/Text/Text";
import type { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import type { ViewProps } from "react-native/Libraries/Components/View/View";
import type { EdgeInsets, SafeAreaViewProps as ContextSafeAreaViewProps } from "react-native-safe-area-context";

declare module "react-native" {
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const ScrollView: React.ComponentType<ScrollViewProps>;
  export const Pressable: React.ComponentType<PressableProps>;
  export const SafeAreaView: React.ComponentType<SafeAreaViewProps>;
  export const Image: React.ComponentType<ImageProps>;
}

declare module "react-native-safe-area-context" {
  export const SafeAreaView: React.ComponentType<ContextSafeAreaViewProps>;
  export function useSafeAreaInsets(): EdgeInsets;
}
