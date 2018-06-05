import Link from 'next/link'
import Router from 'next/router'
import * as React from 'react'
import withPageMetadata, { WithPageMetadataProps } from '../components/global/withPageMetadata'
import dateTimeProvider from '../components/utils/dateTimeProvider'
import Voting from '../components/voting'
import Conference from '../config/conference'
import getConferenceDates from '../config/dates'
import { Session } from '../config/types'
import Page from '../layouts/main'

interface VoteState {
  sessions?: Session[]
  isLoading: boolean
  isError: boolean
}

class VotePage extends React.Component<WithPageMetadataProps, VoteState> {
  static getInitialProps({ res }) {
    const dates = getConferenceDates(Conference, dateTimeProvider.now())
    if (!dates.VotingOpen) {
      return <Error statusCode={404} />
    }
    return {}
  }

  componentWillMount() {
    const that = this
    this.setState({
      isError: false,
      isLoading: true,
    })
    fetch(this.props.pageMetadata.appConfig.getSubmissionsUrl)
      .then(response => {
        if (response.status !== 200) {
          throw response.statusText
        }
        return response.json()
      })
      .then(body =>
        this.setState({
          isLoading: false,
          sessions: body as Session[],
        }),
      )
      .catch(error => {
        that.setState({ isError: true, isLoading: false })
        if (console) {
          // tslint:disable-next-line:no-console
          console.error('Error loading sessions', error)
        }
      })
  }

  render() {
    const minVotes = this.props.pageMetadata.conference.MinVotes
    const maxVotes = this.props.pageMetadata.conference.MaxVotes

    return (
      <Page
        pageMetadata={this.props.pageMetadata}
        title="Vote"
        hideBanner={true}
        description={this.props.pageMetadata.conference.Name + ' voting page.'}
      >
        <div className="container">
          <h1>Voting</h1>

          <p>
            One of the{' '}
            <Link href="/about">
              <a>core tenets of {this.props.pageMetadata.conference.Name}</a>
            </Link>{' '}
            is that the agenda is democratically selected. Session voting is the core mechanism that we employ to
            achieve that. This means that you (collectively) have the power to decide on the agenda on the day.
          </p>

          {this.props.pageMetadata.conference.AnonymousVoting && (
            <p>
              In order to remove unconscious bias we implement anonymous session voting. This means that you will not
              see the details of the presenters and will need to vote based on the content (title, abstract, tags).
            </p>
          )}

          <p>
            This year we have a combination of 20 minute and 45 minutes sessions (or sessions that are designated as
            being able to be both). You can optionally filter the sessions by tag, format and level to assist you to
            create a shortlist. You will be required to vote for{' '}
            {minVotes !== maxVotes ? (
              <span>
                between {minVotes} and {maxVotes}
              </span>
            ) : (
              <span>{minVotes}</span>
            )}{' '}
            sessions.
          </p>

          {!this.state.isLoading &&
            !this.state.isError && (
              <Voting
                sessions={this.state.sessions}
                minVotes={minVotes}
                maxVotes={maxVotes}
                anonymousVoting={this.props.pageMetadata.conference.AnonymousVoting}
              />
            )}
        </div>
      </Page>
    )
  }
}

export default withPageMetadata(VotePage)
