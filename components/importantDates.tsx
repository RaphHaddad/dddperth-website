import React from 'react'
import { Action, Conference } from '../config/types'
import ActionButton from './actionButton'
import ImportantDatesList from './importantDatesList'
import { CurrentDate } from './utils/dateTimeProvider'

export interface ImportantDatesProps {
  conference: Conference
  actions: Action[]
  currentDate: CurrentDate
}

export default ({ conference, actions, currentDate }: ImportantDatesProps) => (
  <section className="important-dates">
    <div className="container">
      <h2>Important Dates</h2>

      <ImportantDatesList conference={conference} currentDate={currentDate} />

      <div className="clear" />

      <div className="what-now">
        <h2>What now?</h2>
        {actions.map(a => <ActionButton action={a} key={a.Title} />)}
      </div>
    </div>
  </section>
)
