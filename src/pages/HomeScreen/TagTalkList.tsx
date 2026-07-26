import { useParams } from 'react-router-dom'
import { getTalksByTag } from '../../data/queries'
import { Breadcrumb } from '../../components/Breadcrumb'
import { TalkCard } from '../../components/TalkCard'
import { useTalks } from '../../data/TalksContext'

export function TagTalkList() {
  const params = useParams()
  const tag = params.tag ? decodeURIComponent(params.tag) : ''
  const allTalks = useTalks()
  const talks = getTalksByTag(allTalks, tag)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-8 sm:py-16">
        <Breadcrumb
          crumbs={[{ label: 'Talks', to: '/' }, { label: 'Tags', to: '/tags' }, { label: tag }]}
        />
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-12 tracking-tight break-words">
          {tag}
        </h1>
        {talks.length === 0 ? (
          <p className="text-slate-500 text-lg sm:text-xl">No talks with this tag.</p>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {talks.map((talk) => (
              <TalkCard key={talk.id} talk={talk} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
