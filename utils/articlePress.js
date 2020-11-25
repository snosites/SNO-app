import * as Amplitude from 'expo-analytics-amplitude'
import * as Haptics from 'expo-haptics'
// import NavigationService from './NavigationService-old'
import { push } from './RootNavigation'
import { actions as globalActions } from '../redux/global'
import { store } from '../redux/configureStore'

export const handleArticlePress = (article, activeDomain) => {
    Haptics.selectionAsync()

    console.log('article press', article)

    // log the article to analytics
    Amplitude.logEventWithProperties('view story', {
        storyId: article.id,
    })
    store.dispatch(globalActions.addStoryView(activeDomain.url, article.id))

    push('ArticleNavigator', { articleId: article.id })
}
