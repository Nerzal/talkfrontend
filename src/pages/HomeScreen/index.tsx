import { useParams } from 'react-router-dom'
import { YearList } from './YearList'
import { MonthList } from './MonthList'
import { TalkList } from './TalkList'

export function HomeScreen() {
  const params = useParams()
  const year = params.year ? parseInt(params.year, 10) : null
  const month = params.month ? parseInt(params.month, 10) : null

  if (year === null) return <YearList />
  if (month === null) return <MonthList year={year} />
  return <TalkList year={year} month={month} />
}
