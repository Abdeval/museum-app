import { Text, TextProps } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';

interface TransTextProps extends TextProps {
    title: string;
}

export default function TransText(props: TransTextProps) {
    const { title, ...rest } = props;
    const { t } = useTranslation();
  return (
    <Text {...rest}>
       {t(title)}
    </Text>
  )
}