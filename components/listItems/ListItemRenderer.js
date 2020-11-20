import React from 'react'

import CompactListItem from './CompactListItem'
import CompactVerticalListItem from './CompactVerticalListItem'
import LargeListItem from './LargeListItem'

const ListItemRenderer = (props) => {
    const { item, theme, index, seperators, onPress = () => {}, listStyle } = props

    switch (listStyle) {
        case 'large':
            return (
                <LargeListItem
                    theme={theme}
                    writers={item.custom_fields.writer || []}
                    title={item.title.rendered || ''}
                    date={item.date}
                    excerpt={item.excerpt.rendered}
                    featuredImageUri={item.featuredImage?.uri}
                    onPress={onPress}
                />
            )
        case 'alternating':
            return (
                <CompactListItem
                    imageRight={index % 2 === 0}
                    theme={theme}
                    writers={item.custom_fields.writer || []}
                    title={item.title.rendered || ''}
                    date={item.date}
                    excerpt={item.excerpt.rendered}
                    featuredImageUri={item.featuredImage?.uri}
                    onPress={onPress}
                />
            )
        case 'compactVertical':
            return (
                <CompactVerticalListItem
                    theme={theme}
                    writers={item.custom_fields.writer || []}
                    title={item.title.rendered || ''}
                    date={item.date}
                    excerpt={item.excerpt.rendered}
                    featuredImageUri={item.featuredImage?.uri}
                    onPress={onPress}
                />
            )
        case 'mix':
            if (index % 3 === 0) {
                return (
                    <LargeListItem
                        theme={theme}
                        writers={item.custom_fields.writer || []}
                        title={item.title.rendered || ''}
                        date={item.date}
                        excerpt={item.excerpt.rendered}
                        featuredImageUri={item.featuredImage?.uri}
                        onPress={onPress}
                    />
                )
            } else {
                return (
                    <CompactListItem
                        theme={theme}
                        writers={item.custom_fields.writer || []}
                        title={item.title.rendered || ''}
                        date={item.date}
                        excerpt={item.excerpt.rendered}
                        featuredImageUri={item.featuredImage?.uri}
                        onPress={onPress}
                    />
                )
            }
        // small and default
        default:
            return (
                <CompactListItem
                    theme={theme}
                    writers={item.custom_fields.writer || []}
                    title={item.title.rendered || ''}
                    date={item.date}
                    excerpt={item.excerpt.rendered}
                    featuredImageUri={item.featuredImage?.uri}
                    onPress={onPress}
                />
            )
    }
}

export default ListItemRenderer
