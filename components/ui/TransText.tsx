import { Text, TextProps } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';

interface TransTextProps extends TextProps {
    title: string;
    number?: number;
    page?: string
}

export default function TransText(props: TransTextProps) {
    const { page, number, title, ...rest } = props;
    const { t } = useTranslation();
  return (
    <Text {...rest}>
       {t(title, { number, page })}
    </Text>
  )
}