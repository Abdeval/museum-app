import { View } from "react-native";
import React from "react";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";

interface LRViewProps extends React.PropsWithChildren {
  children: React.ReactNode;
  className?: string;
}

export default function LRView({ children, ...props }: LRViewProps) {
  const { className } = props;
  const { i18n } = useTranslation();
  return (
    <View
      {...props}
      style={{ flexDirection: i18n.language === "ar" ? "row-reverse" : "row" }}
      className={cn(className)}
    >
      {children}
    </View>
  );
}
