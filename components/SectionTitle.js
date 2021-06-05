import Link from 'next/link'
import SVGNewspaper from './SVG/SVGNewspaper'

export default function SectionTitle({ title, link }) {
  return (
    <>
      <div className='border-b mb-5 flex justify-between text-sm'>
        <Link href={link} disable={link != ''}>
          <a className='text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase font-semibold'>
            <SVGNewspaper />
            {title}
          </a>
        </Link>
        <Link href={link}>
          <a>See All</a>
        </Link>
      </div>
    </>
  )
}
