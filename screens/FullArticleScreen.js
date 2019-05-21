import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Share,
    StatusBar,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import { saveArticle } from '../redux/actions/actions';
import { FAB, Portal, Snackbar } from 'react-native-paper';

import { CustomArticleHeader } from '../components/ArticleHeader';
import ArticleBodyContent from '../views/ArticleBodyContent';


class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />
        };
    };

    state = {
        fabOpen: false,
        showPortal: true,
        snackbarSavedVisible: false,
        expandCaption: false
    };

    render() {
        const { navigation, theme } = this.props;
        const { snackbarSavedVisible } = this.state;

        let article = navigation.getParam('article', 'loading')
        let articleChapters = navigation.getParam('articleChapters', [])

        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <NavigationEvents
                        onDidFocus={() => this.setState({
                            showPortal: true
                        })}
                        onWillBlur={() => {
                            console.log('bluuuuuured');
                            StatusBar.setHidden(false);
                            this.setState({
                                showPortal: false,
                                expandCaption: false
                            })
                        }}
                    />
                    {article !== 'loading' &&
                        <ArticleBodyContent
                            navigation={navigation}
                            article={article}
                            theme={theme}
                            handleCaptionClick={this._handleCaptionClick}
                            expandCaption={this.state.expandCaption}
                        />
                    }
                    {/* display chapters if there are any -- long form stories */}
                    {articleChapters.map(article => (
                        <ArticleBodyContent
                            key={article.id}
                            navigation={navigation}
                            article={article}
                            theme={theme}
                            handleCaptionClick={this._handleCaptionClick}
                            expandCaption={this.state.expandCaption}
                        />
                    ))}

                    {this.state.showPortal && <Portal>
                        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Snackbar
                                visible={snackbarSavedVisible}
                                style={styles.snackbar}
                                duration={3000}
                                onDismiss={() => this.setState({ snackbarSavedVisible: false })}
                                action={{
                                    label: 'Dismiss',
                                    onPress: () => {
                                        this.setState({ snackbarSavedVisible: false })
                                    }
                                }}
                            >
                                Article Added To Saved List
                        </Snackbar>
                            <FAB.Group
                                style={{ flex: 1, position: 'relative', paddingBottom: snackbarSavedVisible ? 100 : 50 }}
                                open={this.state.fabOpen}
                                icon={this.state.fabOpen ? 'clear' : 'add'}
                                actions={[
                                    {
                                        icon: 'comment', label: 'Comment', onPress: () => navigation.navigate('Comments', {
                                            comments: article.comments
                                        })
                                    },
                                    {
                                        icon: 'send', label: 'Share', onPress: () => {
                                            this._shareArticle(article)
                                        }
                                    },
                                    { icon: 'bookmark', label: 'Save', onPress: () => this._handleArticleSave(article) },
                                ]}
                                onStateChange={({ open }) => this.setState({
                                    fabOpen: open
                                })}
                                onPress={() => {
                                    if (this.state.open) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </SafeAreaView>
                    </Portal>}

                </ScrollView>
            </View>
            
        );
    }

    _shareArticle = article => {
        Share.share({
            title: article.title.rendered,
            message: article.title.rendered,
            url: article.link
        })
    }

    _handleArticleSave = article => {
        const { activeDomain } = this.props;
        this.props.dispatch(saveArticle(article, activeDomain.id))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleCaptionClick = () => {
        this.setState({
            expandCaption: !this.state.expandCaption
        })
    }

}

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    snackbar: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0
    },
})

const mapStateToProps = state => ({
    theme: state.theme,
    activeDomain: state.activeDomain
})

export default connect(mapStateToProps)(FullArticleScreen);

{/* <p><span style="font-weight: 400;">Shalhevet’s Fairness Committee will have three co-chairs next year, after a Fairness deliberation changed the result of a Just Community election today for the first time in school history. The decision will take effect next year and apply only to next year, and the Fairness Committee also said the voting process should be improved.</span></p>↵<p><span style="font-weight: 400;">Eight current Fairness members participated in the unanimous decision, which was made after a 30-minute hearing attended by a standing-room-only crowd of around 54 students in Room 308 during breakfast. Several students had to sit on the floor of the room, also known as the Music Room, which is among the largest classrooms at Shalhevet. </span></p>↵<p><span style="font-weight: 400;">It was held a day after leaders of the Agenda Committee asked Fairness to decide what to do, after they decided that the school’s computerized “instant runoff” voting system, being used for the third year, had not accurately tallied the votes.</span></p>↵<p>The reason was that the race was for two equal co-chairs, but votes for the two slots were counted as first- and second-place votes for the same office.&nbsp; This had the effect of not counting some voters&#8217; votes for first place and other voters&#8217; votes for second place.</p>↵<p>That, everyone agreed, yielded a result that did not reflect the community&#8217;s views as to who the Fairness co-chairs should actually be.&nbsp;</p>↵<p><span style="font-weight: 400;">Alumnus Sam Hirshhorn ‘17 &#8212; the computer program&#8217;s author &#8212; pointed this out himself when reviewing the vote results Tuesday night, sharing his view both with Agenda Chair Talia Gill and Fairness candidate Gilad Spitzer, who in the flawed count came in third. </span></p>↵<p><span style="font-weight: 400;">Winners announced on Tuesday had been Joseph Klores and Evan Rubel. &nbsp;The fourth-place candidate was Ashley Botnick. In an instant runoff, voters choose their first, second, third and fourth-place choice for each office. The candidate with the fewest first-place votes is eliminated, and his or her voters’ second choice votes are allotted to the remaining candidates and a new tally made. </span></p>↵<p><span style="font-weight: 400;">Because of the way that system works, second-place votes for candidates other than the candidate with the fewest first-place votes did not play a role in the election, and neither did first-place votes for the candidate with the second-most first-place votes.</span></p>↵<p><span style="font-weight: 400;">Even before the hearing began, the formula Sam created was deemed by both Agenda and Fairness leaders to be unsuitable for contests in which voters were choosing among multiple candidates for two winners.&nbsp;&nbsp;</span></p>↵<p><span style="font-weight: 400;">Sam himself wrote an email to Gilad after learning that he had lost, even though he received the second-most first-place votes of any candidate &#8212; because those votes were not counted or considered.</span></p>↵<p><span style="font-weight: 400;">“After the election, we looked at the results and realized it might potentially make more sense if votes were counted as putting someone number one and number two were [tallied as] equal,” wrote Sam. “We looked to see what would happen if we did that and saw that the results changed (you won).”</span></p>↵<p>Unsure of how to handle the mistake once results had been announced, <a href="https://shalhevetboilingpoint.com/community/2019/05/10/open-fairness-hearing-friday-morning-will-consider-possible-change-to-fairness-chair-election-outcome/">they turned to the Fairness Committee for guidance,</a> which led to Friday&#8217;s hearing.&nbsp;</p>↵<p><span style="font-weight: 400;">After the hearing, the eight Fairness members deliberated for 15 minutes about three options which had been suggested by the candidates to remedy the situation: counting the votes with a system where first- and second-place votes would be given equal weight, re-voting, or having three chairs. </span></p>↵<p><span style="font-weight: 400;">No one argued for keeping the system that had been used, or for staying with the results of the election as they had been announced on Tuesday. </span></p>↵<p><span style="font-weight: 400;">Instead, the Fairness Committee ultimately decided to have three co-chairs for the upcoming year: Joseph, Evan, and Gilad Spitzer, whose votes in the 258-vote election were said to be very close to the other two candidates, and who would have won if the formula had counted all of his first-place votes.</span></p>↵<div id="attachment_32797" style="width: 485px" class="wp-caption alignleft"><img aria-describedby="caption-attachment-32797" class="size-medium wp-image-32797" src="https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-475x317.jpeg" alt="" width="475" height="317" srcset="https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-475x317.jpeg 475w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-768x512.jpeg 768w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-900x600.jpeg 900w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-300x200.jpeg 300w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-128x85.jpeg 128w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-32x21.jpeg 32w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1-122x80.jpeg 122w, https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/harris-fairness-election-1.jpeg 1501w" sizes="(max-width: 475px) 100vw, 475px" /><p id="caption-attachment-32797" class="wp-caption-text"><span class="photocreditinline">BP Photo by Zoey Botnick</span><br /><strong><span style="color: #d11717; font-size: 20px; font-family: 'Roboto';">FOCUS:</span></strong> <span style="color: #414141; font-size: 18px;">Students listened to Dr. Keith Harris, Fairness Committee faculty adviser, explain rules and behavior he expected at the open hearing.<br /></span></p></div>↵<p><span style="font-weight: 400;">“Through tallying the votes to account for this and to stay true to the voting system used for this year, Evan, Joseph and Gilad each have valid claim to the chair position,” wrote the Fairness Committee in a statement provided to the Boiling Point. “Additionally, each candidate exhibited a tremendous amount of maturity and each sought the fairest solution, thus suggesting that all three were deserving of the position.”</span></p>↵<p><span style="font-weight: 400;">The committee that made this decision was made up of its two outgoing co-chairs, Jordana Glouberman and Jonathan Fishman, and six representatives instead of the normal eight. That’s because Evan, the current Fairness Secretary, and Gilad and Joseph, this year’s 11th-grade representatives, had all run for co-chair and therefore could not be part of the deliberation. Fairness Secretary-elect and current 9th-grade representative Henry Fried served as secretary.</span></p>↵<p><span style="font-weight: 400;">While the majority of the speakers were in favor of having three co-chairs, Evan believed that the only way to move forward was with a re-vote. Around 2 hours after the hearing, Evan clarified his stance. </span></p>↵<p><span style="font-weight: 400;">“Since it’s become so muddy whether we should be using the first program or the second program,” Evan said. “The only fair thing to do is have a clean slate and redo the vote with an informed student body and a correctly formatted and structured ballot.”</span></p>↵<p><span style="font-weight: 400;">The meeting began with Agenda Chair Talia Gill explaining how the instant runoff voting system worked in this election, and why it was problematic.</span></p>↵<p><span style="font-weight: 400;">Next, Gilad Spitzer presented his case as to how the system was flawed and what should be done to address it.</span></p>↵<p><span style="font-weight: 400;">“The election was unfair and produced faulty results,” said Gilad. </span></p>↵<p><span style="font-weight: 400;">Gilad addressed both the revote and recount solutions, saying that he would understand if the committee came to either conclusion, yet he felt they each had flaws. </span></p>↵<p><span style="font-weight: 400;">“[But] if the committee decides either of those… there is a loser, and there is someone who is being unfairly treated,” he said. “That’s why I think a potential solution, if the committee deems it appropriate, could be a partial solution, only this year, that would allow for three chairs to preside on the Fairness Committee.”</span></p>↵<p><span style="font-weight: 400;">Gilad said the instant runoff system should have accounted for the fact that there would be two co-chairs &#8212; that rather than ranking candidates in order 1,2,3,4, students would have voted 1,1,3,4, thus equalizing the points allotted to their top two first-choice candidates. </span></p>↵<p><span style="font-weight: 400;">Throughout the controversy, the absence of a school </span><a href="https://shalhevetboilingpoint.com/community/2016/05/18/original-shalhevet-constitution-complete-text/"><span style="font-weight: 400;">Constitution</span></a><span style="font-weight: 400;"> was keenly felt, making the Agenda and Fairness committees unsure of their responsibilities regarding elections. On the one hand, there is no clause in the old school Constitution about who should run elections. On the other, it offers a process to amend the Constitution &#8212; perhaps including election rules &#8212; if approved by a two-thirds majority.</span></p>↵<p><span style="font-weight: 400;">There is no discussion at all of how a contested election is supposed to be handled or which committee should handle it. But on the other hand, the Constitution has not been followed in recent years in any case.</span></p>↵<p><span style="font-weight: 400;">In his prepared remarks, Gilad referenced a </span><a href="https://shalhevetboilingpoint.com/top-stories/2017/04/28/one-week-before-elections-agenda-changes-policy-for-voting/"><span style="font-weight: 400;">2017 Boiling Point article</span></a><span style="font-weight: 400;"> about the Agenda Committee&#8217;s original decision to adopt the instant-runoff voting system. He pointed to the fact that at that time, a committee of nine voted 5-4 to approve the vote to amend the the school Constitution, which originally stated that candidates were elected by a simple majority. </span></p>↵<p><span style="font-weight: 400;">With a two-thirds majority vote required to approve a Constitutional amendment, “I don’t know why this was even instituted,” said Gilad.</span></p>↵<p><span style="font-weight: 400;">Additionally, Gilad said that the 2017 &nbsp;proposal was never brought before the Just Community as a whole at Town Hall &nbsp;because there wasn’t enough time left in the school year when it arose &#8212; so the students never had any say in the manner. </span></p>↵<p><span style="font-weight: 400;">After Gilad spoke, both Evan and Joseph had an opportunity to share their view of events and express their opinion on moving forward.</span></p>↵<p><span style="font-weight: 400;">Evan argued for a revote.</span></p>↵<p><span style="font-weight: 400;">“The students were not well-informed of how the ranking was happening,” said Evan. “I believe that the way the ballot was structured, in that were was a first choice and second choice, was fundamentally flawed.”</span></p>↵<p><span style="font-weight: 400;">Evan expanded on his reasoning in an interview </span><span style="font-weight: 400;">after the deliberations had ended but before the results had been announced, saying he said he feared the example that overturning an election would set for future elections. </span></p>↵<p><span style="font-weight: 400;">“If there is a close race in the future, what’s to stop a candidate from saying, ‘Look there was a mistake in the program or the ballot was fundamentally flawed?’” Evan said.</span></p>↵<p><span style="font-weight: 400;">“I think it would be great for all three of us to participate in this amazing opportunity,” Evan said. “ I just don’t know if it&#8217;s in the interest of the students if adding a third [co-chair] would necessarily take away from the student’s voice, because that’s not necessarily what they voted for.” </span></p>↵<p><span style="font-weight: 400;">Joseph spoke during the meeting in favor of either recounting the votes but with the system that counted first and second place votes as the same, or having three chairs.</span></p>↵<p><span style="font-weight: 400;">“Gilad, Evan and I are all well-deserving and qualified for this position, and because of it and the unorthodox turn of a events, I would be open to having three chairs,” Joseph said. “On the other hand, if that is not deemed fair by the committee I think the only other fair course of action would be to recalculate the votes from the election.”</span></p>↵<p><span style="font-weight: 400;">He also saw flaws with a potential revote.</span></p>↵<p><span style="font-weight: 400;">“Conditions are now different than how they were, which could influence positions and change the data which we currently have,” said Joseph. “Also the seniors finish school today and it is very possible that some are not inclined to vote. And with re-elections, there is usually a lower voter turnout, which could also affect the new results.”</span></p>↵<p><span style="font-weight: 400;">In an interview after the meeting but before results were announced, Gilad said he was surprised how much agreement there was among him, Joseph and Evan.<div class='related relatedvert left  background-white shadow borderall sno-animate' style='border-color: #eeeeee;'><h5>Related Stories</h5><a href="https://shalhevetboilingpoint.com/top-stories/2019/05/10/open-fairness-hearing-friday-morning-will-consider-possible-change-to-fairness-chair-election-outcome/" title="Open Fairness hearing Friday morning will consider possible change to Fairness Chair election outcome"><img src="https://shalhevetboilingpoint.com/wp-content/uploads/2019/05/FullSizeRender-240x150.jpeg" style="width:100%" class="catboxphoto" alt="Open Fairness hearing Friday morning will consider possible change to Fairness Chair election outcome" /></a><h5 class="relatedtitle"><a href="https://shalhevetboilingpoint.com/top-stories/2019/05/10/open-fairness-hearing-friday-morning-will-consider-possible-change-to-fairness-chair-election-outcome/">Open Fairness hearing Friday morning will consider possible change to Fairness Chair election outcome</a></h5><div class="clear"></div></div> </span></p>↵<p><span style="font-weight: 400;">“I had not spoken to either of them since this was discovered,” Gilad said. “I was surprised how much me along with Joseph and Evan agreed on. I’m optimistic about what’s to come.”</span></p>↵<p><span style="font-weight: 400;">Everyone seems to agree that the school’s election system needs to be changed, but few seem to be saying who should change it. </span></p>↵<p><span style="font-weight: 400;"> &#8220;I recommend that the Fairness committee as a whole decide how voting should work,” said Gilad Spitzer.</span></p>↵<p><span style="font-weight: 400;">The Fairness Committee, in today’s ruling, used the passive voice and left the details for the future.</span></p>↵<p><span style="font-weight: 400;">“The decision for having three chairs would only apply to the 2019-2020 school year and the voting process must be amended for future elections,” the Fairness decision said today.</span></p>↵<p><span style="font-weight: 400;">And junior Ashley Botnick, the only Fairness chair candidates not to be awarded the position for next year, spoke for many in agreeing that one way or another, this week’s events should not be repeated.</span></p>↵<p><span style="font-weight: 400;">“I think that all three of them are very much deserving of the role,” Ashley said. “I just think that the big picture and take-away from this case should be that a new voting system has to be implemented to ensure this does not happen again.”</span></p>↵<p><i><span style="font-weight: 400;">Torah Editor Nicholas Fields &nbsp;contributed to this article.</span></i></p>↵ */}